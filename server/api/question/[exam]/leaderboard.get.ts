export default defineEventHandler(async (event) => {
  const exam = event.context.params?.exam;

  if (!exam) {
    throw createError({
      statusCode: 400,
      statusMessage: "examId query parameter is required",
    });
  }

  const queryParams = getQuery(event);

  // Get pagination parameters from the string
  const page = parseInt(queryParams.page as string, 10) || 1;
  const pageSize = parseInt(queryParams.pageSize as string, 10) || 25;
  const search = queryParams.search ? queryParams.search.toString().trim() : "";

  // Calculate the offset
  const skip = (page - 1) * pageSize;

  const examDataResult = await query<{
    id: string;
    title: string;
    subject: string;
    level: string;
    start_time: string;
    end_time: string;
    duration: number;
    total_marks: number;
  }>(`SELECT * FROM free_exam_exams WHERE id = $1`, [exam]);

  const examData = examDataResult.data?.[0];

  // Fetch the leaderboard data with search, pagination, and sorting
  const leaderboardResult = await query<{
    id: string;
    user_name: string;
    user_institute: string;
    marks: number;
    duration: number;
    submitted_at: string;
  }>(`
    SELECT 
      s.id,
      u.name as user_name,
      u.institute as user_institute,
      s.marks,
      s.duration,
      s.submitted_at
    FROM free_exam_submissions s
    JOIN free_exam_users u ON s.user_id = u.id
    WHERE s.exam_id = $1 
      AND u.name ILIKE $2
    ORDER BY s.marks DESC, s.duration ASC
    LIMIT $3 OFFSET $4
  `, [exam, `%${search}%`, pageSize, skip]);

  const leaderboard = (leaderboardResult.data || []).map(item => ({
    id: item.id,
    user: {
      name: item.user_name,
      institute: item.user_institute,
    },
    marks: item.marks,
    duration: item.duration,
    submitted_at: item.submitted_at,
  }));

  // Fetch the total count of submissions for the exam with the search filter applied
  const totalSubmissionsResult = await query<{count: number}>(
    `SELECT COUNT(*) as count FROM free_exam_submissions WHERE exam_id = $1`, 
    [exam]
  );

  const totalSubmissions = totalSubmissionsResult.data?.[0]?.count || 0;

  return {
    examData,
    leaderboard,
    pagination: {
      page,
      pageSize,
      total: totalSubmissions,
      totalPages: Math.ceil(totalSubmissions / pageSize),
    },
  };
});
