import { query } from "~/server/utils/db";
import { getQuery, createError, defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event);

    const user = event.context.user?.id

    // Pagination and search
    const page = Math.max(1, parseInt(queryParams.page as string, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(queryParams.pageSize as string, 10) || 25));
    const search = queryParams.search ? queryParams.search.toString().trim() : "";
    const skip = (page - 1) * pageSize;

    // Fetch all exams
    const examsResult = await query<{
      id: string;
      title: string;
      total_marks: number;
      duration: number;
    }>(
      `SELECT id, title, total_marks, duration 
      FROM free_exam_exams
      ORDER BY start_time ASC`
    );

    if (!examsResult.success) {
      throw createError({
        statusCode: 500,
        statusMessage: "Database error while fetching exams",
      });
    }

    const exams = examsResult.data || [];
    if (exams.length === 0) {
      return {
        campaignData: null,
        exams: [],
        leaderboard: [],
        pagination: {
          page,
          pageSize,
          total: 0,
          totalPages: 0,
        },
      };
    }

    const examIds = exams.map(exam => exam.id);
    const totalPossibleMarks = exams.reduce((sum, exam) => sum + exam.total_marks, 0);

    // First, get all users with their ranks based on average marks (without search filter)
    const allUsersRankingResult = await query<{
      user_id: string;
      rank: number;
    }>(
      `SELECT 
        u.id as user_id,
        ROW_NUMBER() OVER (ORDER BY AVG(s.marks) DESC, SUM(s.duration) ASC) as rank
      FROM free_exam_users u
      JOIN free_exam_submissions s ON u.id = s.user_id
      WHERE s.exam_id = ANY($1) 
        AND s.status = 'submitted'
        AND s.duration >= 120000
        AND u.name ~ '^[A-Za-z]{3,}$'
      GROUP BY u.id
    `, [examIds]);

    if (!allUsersRankingResult.success) {
      throw createError({
        statusCode: 500,
        statusMessage: "Database error while calculating rankings",
      });
    }

    // Create a map of user_id to rank
    const userRankMap = new Map(
      (allUsersRankingResult.data || []).map(item => [item.user_id, item.rank])
    );

    // Now get the filtered leaderboard data with search
    const leaderboardResult = await query<{
      user_id: string;
      user_name: string;
      user_institute: string;
      total_exams_attempted: number;
      total_marks_obtained: number;
      average_marks: number;
      total_duration: number;
      average_duration: number;
    }>(
      `SELECT 
        u.id as user_id,
        u.name as user_name,
        u.institute as user_institute,
        COUNT(s.id) as total_exams_attempted,
        COALESCE(SUM(s.marks), 0) as total_marks_obtained,
        ROUND(AVG(s.marks)::numeric, 2) as average_marks,
        COALESCE(SUM(s.duration), 0) as total_duration,
        ROUND(AVG(s.duration)::numeric, 0) as average_duration
      FROM free_exam_users u
      JOIN free_exam_submissions s ON u.id = s.user_id
      WHERE s.exam_id = ANY($1) 
        AND s.status = 'submitted'
        AND s.duration >= 120000
        AND u.name ILIKE $2
        AND u.name ~ '^[A-Za-z]{3,}$'
      GROUP BY u.id, u.name, u.institute
      ORDER BY average_marks DESC, total_duration ASC
      LIMIT $3 OFFSET $4
    `, [examIds, `%${search}%`, pageSize, skip]);

    if (!leaderboardResult.success) {
      throw createError({
        statusCode: 500,
        statusMessage: "Database error while fetching leaderboard data",
      });
    }

    const leaderboard = (leaderboardResult.data || []).map((item) => ({
      id: item.user_id,
      rank: userRankMap.get(item.user_id) || 0,
      user: {
        name: item.user_name,
        institute: item.user_institute,
      },
      marks: item.total_marks_obtained,
      totalPossibleMarks: totalPossibleMarks,
      totalExamsAttempted: item.total_exams_attempted,
      totalExams: exams.length,
      averageMarks: item.average_marks,
      duration: item.total_duration,
      averageDuration: item.average_duration,
      completionPercentage: exams.length > 0 ? Math.round((item.total_exams_attempted / exams.length) * 100) : 0,
      scorePercentage: totalPossibleMarks > 0 ? Math.round((item.total_marks_obtained / totalPossibleMarks) * 100) : 0,
      isSuspicious: false,
    }));

    // Get total count of users who participated in any exam
    const totalParticipantsResult = await query<{count: number}>(
      `SELECT COUNT(DISTINCT u.id) as count 
      FROM free_exam_users u
      JOIN free_exam_submissions s ON u.id = s.user_id
      WHERE s.exam_id = ANY($1) 
        AND s.status = 'submitted'
        AND s.duration >= 120000
        AND u.name ILIKE $2
        AND u.name ~ '^[A-Za-z]{3,}$'
    `, [examIds, `%${search}%`]);

    if (!totalParticipantsResult.success) {
      throw createError({
        statusCode: 500,
        statusMessage: "Database error while fetching participant count",
      });
    }

    const totalParticipants = totalParticipantsResult.data?.[0]?.count || 0;

    return {
      campaignData: null,
      exams,
      leaderboard,
      pagination: {
        page,
        pageSize,
        total: totalParticipants,
        totalPages: Math.ceil(totalParticipants / pageSize),
      },
    };
  } catch (error) {
    console.error("Error in leaderboard API:", error);
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error while fetching leaderboard",
    });
  }
});