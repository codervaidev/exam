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

  return {
    userCount,
    examCount,
    submissionCount,
    questionCount,
    activeSessionCount,
  };
});
