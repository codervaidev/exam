export default defineEventHandler(async (event) => {
  try {
    const campaignId = event.context.params?.id;

    if (!campaignId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Campaign ID is required",
      });
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(campaignId)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid campaign ID format",
      });
    }

    const queryParams = getQuery(event);

    // Get pagination parameters from the query string with validation
    const page = Math.max(1, parseInt(queryParams.page as string, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(queryParams.pageSize as string, 10) || 25));
    const search = queryParams.search ? queryParams.search.toString().trim() : "";

  // Calculate the offset
  const skip = (page - 1) * pageSize;

    // Get campaign data
    const campaignDataResult = await query<{
      id: string;
      title: string;
      description: string;
      start_time: string;
      end_time: string;
      status: string;
      total_exam: number;
      level: string;
    }>(`SELECT * FROM free_exam_campaigns WHERE id = $1`, [campaignId]);

    if (!campaignDataResult.success) {
      throw createError({
        statusCode: 500,
        statusMessage: "Database error while fetching campaign",
      });
    }

    const campaignData = campaignDataResult.data?.[0];

    if (!campaignData) {
      throw createError({
        statusCode: 404,
        statusMessage: "Campaign not found",
      });
    }

    // Get all exams for this campaign
    const examsResult = await query<{
      id: string;
      title: string;
      total_marks: number;
      duration: number;
    }>(`
      SELECT id, title, total_marks, duration 
      FROM free_exam_exams 
      WHERE campaign_id = $1
      ORDER BY start_time ASC
    `, [campaignId]);

    if (!examsResult.success) {
      throw createError({
        statusCode: 500,
        statusMessage: "Database error while fetching exams",
      });
    }

    const exams = examsResult.data || [];

  if (exams.length === 0) {
    return {
      campaignData,
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

  // Calculate total possible marks for all exams in the campaign
  const totalPossibleMarks = exams.reduce((sum, exam) => sum + exam.total_marks, 0);

    // Calculate total scores per user across all exams in the campaign
    const leaderboardResult = await query<{
      user_id: string;
      user_name: string;
      user_institute: string;
      total_exams_attempted: number;
      total_marks_obtained: number;
      average_marks: number;
      total_duration: number;
      average_duration: number;
    }>(`
      SELECT 
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
        AND u.name ILIKE $2
      GROUP BY u.id, u.name, u.institute
      ORDER BY total_marks_obtained DESC, total_duration ASC
      LIMIT $3 OFFSET $4
    `, [examIds, `%${search}%`, pageSize, skip]);

    if (!leaderboardResult.success) {
      throw createError({
        statusCode: 500,
        statusMessage: "Database error while fetching leaderboard data",
      });
    }

  const leaderboard = (leaderboardResult.data || []).map((item, index) => ({
    id: item.user_id,
    rank: skip + index + 1,
    user: {
      name: item.user_name,
      institute: item.user_institute,
    },
    marks: item.total_marks_obtained,
    totalPossibleMarks: totalPossibleMarks,
    totalExamsAttempted: item.total_exams_attempted,
    totalExamsInCampaign: exams.length,
    averageMarks: item.average_marks,
    duration: item.total_duration,
    averageDuration: item.average_duration,
    completionPercentage: exams.length > 0 ? Math.round((item.total_exams_attempted / exams.length) * 100) : 0,
    scorePercentage: totalPossibleMarks > 0 ? Math.round((item.total_marks_obtained / totalPossibleMarks) * 100) : 0,
  }));

    // Get total count of users who participated in this campaign
    const totalParticipantsResult = await query<{count: number}>(`
      SELECT COUNT(DISTINCT u.id) as count 
      FROM free_exam_users u
      JOIN free_exam_submissions s ON u.id = s.user_id
      WHERE s.exam_id = ANY($1) 
        AND s.status = 'submitted'
        AND u.name ILIKE $2
    `, [examIds, `%${search}%`]);

    if (!totalParticipantsResult.success) {
      throw createError({
        statusCode: 500,
        statusMessage: "Database error while fetching participant count",
      });
    }

    const totalParticipants = totalParticipantsResult.data?.[0]?.count || 0;

    return {
      campaignData,
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
    console.error("Error in campaign leaderboard API:", error);
    
    // If it's already a createError, just re-throw it
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }
    
    // Otherwise, wrap it in a 500 error
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error while fetching leaderboard",
    });
  }
}); 