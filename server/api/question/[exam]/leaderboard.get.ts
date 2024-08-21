export default defineEventHandler(async (event) => {
  const exam = event.context.params?.exam;

  if (!exam) {
    throw createError({
      statusCode: 400,
      statusMessage: "examId query parameter is required",
    });
  }

  const examData = await db.exam.findUnique({
    where: {
      id: exam as string,
    },
  });

  // Fetch the leaderboard data
  const leaderboard = await db.submission.findMany({
    where: {
      examId: exam as string,
    },
    orderBy: {
      marks: "desc",
    },
    select: {
      user: {
        select: {
          name: true,
          institute: true,
        },
      },
      marks: true,
      duration: true,
      submittedAt: true,
    },
    // take: 10,
  });

  return {
    examData,
    leaderboard,
  };
});
