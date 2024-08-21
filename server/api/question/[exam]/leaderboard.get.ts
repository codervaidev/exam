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
      //   status: "completed", // Assuming 'completed' status means the submission is valid for leaderboard
    },
    orderBy: {
      marks: "desc", // Sort by marks in descending order
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
    take: 10, // Limit to top 10 results, adjust as needed
  });

  return leaderboard;
});
