export default defineEventHandler(async (event) => {
  // Count of total users
  const userCountResult = await query<{count: number}>(`SELECT COUNT(*) as count FROM free_exam_users`);
  const userCount = userCountResult.data?.[0]?.count || 0;

  // Count of total exams
  const examCountResult = await query<{count: number}>(`SELECT COUNT(*) as count FROM free_exam_exams`);
  const examCount = examCountResult.data?.[0]?.count || 0;

  // Count of total submissions
  const submissionCountResult = await query<{count: number}>(`SELECT COUNT(*) as count FROM free_exam_submissions`);
  const submissionCount = submissionCountResult.data?.[0]?.count || 0;

  // Count of total questions
  const questionCountResult = await query<{count: number}>(`SELECT COUNT(*) as count FROM free_exam_questions`);
  const questionCount = questionCountResult.data?.[0]?.count || 0;

  // Count of active sessions (you might define 'active' based on your needs)
  const activeSessionCountResult = await query<{count: number}>(
    `SELECT COUNT(*) as count FROM free_exam_sessions WHERE expires_at > $1`, 
    [new Date()]
  );
  const activeSessionCount = activeSessionCountResult.data?.[0]?.count || 0;

  // Count of total campaigns
  const campaignCountResult = await query<{count: number}>(`SELECT COUNT(*) as count FROM free_exam_campaigns`);
  const campaignCount = campaignCountResult.data?.[0]?.count || 0;

  // Recent registrations (last 7 days)
  const recentRegistrationsResult = await query<{count: number}>(
    `SELECT COUNT(*) as count FROM free_exam_users WHERE created_at > NOW() - INTERVAL '7 days'`
  );
  const recentRegistrations = recentRegistrationsResult.data?.[0]?.count || 0;

  // Recent submissions (last 7 days)
  const recentSubmissionsResult = await query<{count: number}>(
    `SELECT COUNT(*) as count FROM free_exam_submissions WHERE created_at > NOW() - INTERVAL '7 days'`
  );
  const recentSubmissions = recentSubmissionsResult.data?.[0]?.count || 0;

  // Average exam attempts per user
  const avgAttemptsResult = await query<{avg: number}>(
    `SELECT AVG(attempts) as avg FROM (SELECT COUNT(*) as attempts FROM free_exam_submissions GROUP BY user_id) t`
  );
  const avgExamAttempts = parseFloat((avgAttemptsResult.data?.[0]?.avg ?? '0').toString());

  // Average score per exam
  const avgScoreResult = await query<{avg: number}>(
    `SELECT AVG(marks) as avg FROM free_exam_submissions WHERE status = 'submitted'`
  );
  const avgScorePerExam = parseFloat((avgScoreResult.data?.[0]?.avg ?? '0').toString());

  // Top performing users (top 5 by avg marks)
  const topUsersResult = await query<{user_id: string; name: string; avg_marks: number}>(
    `SELECT u.id as user_id, u.name, AVG(s.marks) as avg_marks FROM free_exam_submissions s JOIN free_exam_users u ON s.user_id = u.id WHERE s.status = 'submitted' GROUP BY u.id, u.name ORDER BY avg_marks DESC LIMIT 5`
  );
  const topUsers = topUsersResult.data || [];

  // Most attempted exams (top 5)
  const mostAttemptedExamsResult = await query<{exam_id: string; title: string; attempts: number}>(
    `SELECT e.id as exam_id, e.title, COUNT(s.id) as attempts FROM free_exam_submissions s JOIN free_exam_exams e ON s.exam_id = e.id GROUP BY e.id, e.title ORDER BY attempts DESC LIMIT 5`
  );
  const mostAttemptedExams = mostAttemptedExamsResult.data || [];

  // User growth trend (last 30 days)
  const userGrowthResult = await query<{date: string; count: number}>(
    `SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date, COUNT(*) as count FROM free_exam_users WHERE created_at > NOW() - INTERVAL '30 days' GROUP BY date ORDER BY date`
  );
  const userGrowth = userGrowthResult.data || [];

  // Submission growth trend (last 30 days)
  const submissionGrowthResult = await query<{date: string; count: number}>(
    `SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date, COUNT(*) as count FROM free_exam_submissions WHERE created_at > NOW() - INTERVAL '30 days' GROUP BY date ORDER BY date`
  );
  const submissionGrowth = submissionGrowthResult.data || [];

  return {
    userCount,
    examCount,
    submissionCount,
    questionCount,
    activeSessionCount,
    campaignCount,
    recentRegistrations,
    recentSubmissions,
    avgExamAttempts,
    avgScorePerExam,
    topUsers,
    mostAttemptedExams,
    userGrowth,
    submissionGrowth,
  };
});
