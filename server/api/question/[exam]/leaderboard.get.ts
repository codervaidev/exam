export default defineEventHandler(async (event) => {
  const exam = event.context.params?.exam;

  if (!exam) {
    throw createError({
      statusCode: 400,
      statusMessage: "examId query parameter is required",
    });
  }

  const query = getQuery(event);

  // Get pagination parameters from the query string
  const page = parseInt(query.page as string, 10) || 1;
  const pageSize = parseInt(query.pageSize as string, 10) || 25;
  const search = query.search ? query.search.toString().trim() : "";

  // Calculate the offset
  const skip = (page - 1) * pageSize;

  const examData = await db.exam.findUnique({
    where: {
      id: exam as string,
    },
  });

  // Fetch the leaderboard data with search, pagination, and sorting
  const leaderboard = await db.submission.findMany({
    where: {
      examId: exam as string,
      user: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    },
    orderBy: [
      {
        marks: "desc",
      },
      {
        duration: "asc",
      },
    ],
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
    skip: skip, // Skip the records for pagination
    take: pageSize, // Limit the number of records
  });

  // Fetch the total count of submissions for the exam with the search filter applied
  const totalSubmissions = await db.submission.count({
    where: {
      examId: exam as string,
    },
  });

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
