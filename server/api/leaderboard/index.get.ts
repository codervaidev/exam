import { query } from "~/server/utils/db";
import { getQuery, createError, defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event);


    const user_id = event.context.user?.id

   
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
      start_time: string;
    }>(
      `SELECT id, title, total_marks, duration, start_time 
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
    const now = new Date();
    const completedExamsCount = exams.filter(exam => new Date(exam.start_time) <= now).length;

    // First, get all users with their ranks based on average marks (without search filter)
    const allUsersRankingResult = await query<{
      user_id: string;
      rank: number;
    }>(
      `SELECT 
        u.id as user_id,
        ROW_NUMBER() OVER (
          ORDER BY 
            (CASE WHEN $2::int > 0 THEN COALESCE(SUM(s.marks), 0)::numeric / $2 ELSE 0 END) DESC,
            SUM(s.duration) ASC
        ) as rank
      FROM free_exam_users u
      JOIN free_exam_submissions s ON u.id = s.user_id
      WHERE s.exam_id = ANY($1) 
        AND s.status = 'submitted'
        AND s.duration >= 120000
        AND char_length(u.name) > 2
      GROUP BY u.id
    `, [examIds, completedExamsCount]);

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
        ROUND(
          (CASE WHEN $5::int > 0 THEN COALESCE(SUM(s.marks), 0)::numeric / $5 ELSE 0 END)
        , 2) as average_marks,
        COALESCE(SUM(s.duration), 0) as total_duration,
        ROUND(AVG(s.duration)::numeric, 0) as average_duration
      FROM free_exam_users u
      JOIN free_exam_submissions s ON u.id = s.user_id
      WHERE s.exam_id = ANY($1) 
        AND s.status = 'submitted'
        AND s.duration >= 120000
        AND u.name ILIKE $2
        AND char_length(u.name) > 2
      GROUP BY u.id, u.name, u.institute
      ORDER BY average_marks DESC, total_duration ASC
      LIMIT $3 OFFSET $4
    `, [examIds, `%${search}%`, pageSize, skip, completedExamsCount]);

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
        AND char_length(u.name) > 2
    `, [examIds, `%${search}%`]);

    if (!totalParticipantsResult.success) {
      throw createError({
        statusCode: 500,
        statusMessage: "Database error while fetching participant count",
      });
    }

    const totalParticipants = totalParticipantsResult.data?.[0]?.count || 0;

    // Fetch personal result if user_id is available
    let personal_result = null;
    if (user_id) {
      // Fetch basic user info
      const userResult = await query<{
        id: string;
        name: string;
        institute: string;
      }>(
        `SELECT id, name, institute 
         FROM free_exam_users 
         WHERE id = $1`,
        [user_id]
      );

      if (userResult.success && userResult.data?.[0]) {
        const user = userResult.data[0];

        // Get user's rank
        const userRank = userRankMap.get(user_id) || 0;

        // Fetch per-exam results for the user
        const userResultsResult = await query<{
          exam_id: string;
          title: string;
          exam_total_marks: number;
          exam_duration: number;
          start_time: string;
          end_time: string;
          submission_id: string;
          marks: number;
          correct: number;
          incorrect: number;
          skipped: number;
          submission_duration: number;
          submitted_at: string | null;
          status: string;
        }>(
          `SELECT 
            e.id as exam_id,
            e.title,
            e.total_marks as exam_total_marks,
            e.duration as exam_duration,
            e.start_time,
            e.end_time,
            s.id as submission_id,
            s.marks,
            s.correct,
            s.incorrect,
            s.skipped,
            s.duration as submission_duration,
            s.submitted_at,
            s.status
          FROM free_exam_submissions s
          JOIN free_exam_exams e ON s.exam_id = e.id
          WHERE s.user_id = $1
            AND s.status = 'submitted'
            AND s.duration >= 120000
          ORDER BY e.start_time ASC`,
          [user_id]
        );

        if (userResultsResult.success) {
          const results = (userResultsResult.data || []).map((r) => ({
            examId: r.exam_id,
            title: r.title,
            totalMarks: r.exam_total_marks,
            examDuration: r.exam_duration,
            startTime: r.start_time,
            endTime: r.end_time,
            submissionId: r.submission_id,
            marks: r.marks,
            correct: r.correct,
            incorrect: r.incorrect,
            skipped: r.skipped,
            duration: r.submission_duration,
            submittedAt: r.submitted_at,
            status: r.status,
            percentage: r.exam_total_marks > 0 ? Math.round((r.marks / r.exam_total_marks) * 100) : 0
          }));

          const totals = results.reduce(
            (acc, r) => {
              acc.totalExamsAttempted += 1;
              acc.totalMarksObtained += r.marks;
              acc.totalDuration += r.duration || 0;
              return acc;
            },
            { totalExamsAttempted: 0, totalMarksObtained: 0, totalDuration: 0 }
          );

          const averageMarks = completedExamsCount > 0
            ? Math.round((totals.totalMarksObtained / completedExamsCount) * 100) / 100
            : 0;

          const averageDuration = totals.totalExamsAttempted > 0
            ? Math.round(totals.totalDuration / totals.totalExamsAttempted)
            : 0;

          personal_result = {
            user,
            overview: {
              completedExamsCount,
              totalExamsAttempted: totals.totalExamsAttempted,
              totalMarksObtained: totals.totalMarksObtained,
              averageMarks,
              totalDuration: totals.totalDuration,
              averageDuration,
              rank: userRank
            },
            results
          };
        }
      }
    }

    return {
      campaignData: null,
      exams,
      leaderboard,
      personal_result,
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