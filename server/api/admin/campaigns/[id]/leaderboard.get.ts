
export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);

  const campaignId = event.context.params?.id;

  if (!campaignId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Campaign ID is required",
    });
  }

  const queryParams = getQuery(event);

  // Get pagination parameters from the query string
  const page = parseInt(queryParams.page as string, 10) || 1;
  const pageSize = parseInt(queryParams.pageSize as string, 10) || 25;
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
  }>(`
    SELECT id, title, total_marks 
    FROM free_exam_exams 
    WHERE campaign_id = $1
  `, [campaignId]);

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

  // Calculate average scores per user across all exams in the campaign
  const leaderboardResult = await query<{
    user_id: string;
    user_name: string;
    user_institute: string;
    user_phone: string;
    user_district: string;
    user_thana: string;
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
      u.phone as user_phone,
      u.district as user_district,
      u.thana as user_thana,
      COUNT(s.id) as total_exams_attempted,
      SUM(s.marks) as total_marks_obtained,
      ROUND(AVG(s.marks)::numeric, 2) as average_marks,
      SUM(s.duration) as total_duration,
      ROUND(AVG(s.duration)::numeric, 0) as average_duration
    FROM free_exam_users u
    JOIN free_exam_submissions s ON u.id = s.user_id
    WHERE s.exam_id = ANY($1) 
      AND s.status = 'submitted'
      AND u.name ILIKE $2
    GROUP BY u.id, u.name, u.institute, u.phone, u.district, u.thana
    ORDER BY average_marks DESC, average_duration ASC
    LIMIT $3 OFFSET $4
  `, [examIds, `%${search}%`, pageSize, skip]);

  const leaderboard = (leaderboardResult.data || []).map(item => ({
    user: {
      id: item.user_id,
      name: item.user_name,
      institute: item.user_institute,
      phone: item.user_phone,
      district: item.user_district,
      thana: item.user_thana,
    },
    stats: {
      totalExamsAttempted: item.total_exams_attempted,
      totalExamsInCampaign: exams.length,
      totalMarksObtained: item.total_marks_obtained,
      averageMarks: item.average_marks,
      totalDuration: item.total_duration,
      averageDuration: item.average_duration,
    },
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
});

