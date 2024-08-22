export default defineEventHandler(async (event) => {
  // Count of total users
  const userCount = await db.user.count();

  // Count of total exams
  const examCount = await db.exam.count();

  // Count of total submissions
  const submissionCount = await db.submission.count();

  // Count of total questions
  const questionCount = await db.question.count();

  // Count of active sessions (you might define 'active' based on your needs)
  const activeSessionCount = await db.session.count({
    where: {
      expiresAt: {
        gt: new Date(), // Active sessions are those that haven't expired yet
      },
    },
  });


 


  return {
    userCount,
    examCount,
    submissionCount,
    questionCount,
    activeSessionCount,
  };
});
