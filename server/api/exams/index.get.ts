export default defineEventHandler(async (event) => {
  const exams = await db.exam.findMany({
    where: {
      id: {
        not: "66c4ca1e4f7234b6f01a4a26",
      },
    },
    include: {
      submissions: {
        where: {
          userId: event.context.user?.id,
        },
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  const currentDate = new Date();

  const examsWithStatus = exams.map((exam) => {
    let status = "";

    if (currentDate < new Date(exam.startTime)) {
      status = "upcoming";
    } else if (
      currentDate >= new Date(exam.startTime) &&
      currentDate <= new Date(exam.endTime)
    ) {
      status = "ongoing";
    } else if (currentDate > new Date(exam.startTime)) {
      status = "past";
    }

    return {
      ...exam,
      status,
      submission: exam.submissions?.[0],
    };
  });

  const ongoingExams = examsWithStatus.filter((e) => e.status === "ongoing");
  const upcomingExams = examsWithStatus.filter((e) => e.status === "upcoming");
  const pastExams = examsWithStatus.filter((e) => e.status === "past");

  return {
    statusCode: 200,
    body: {
      ongoingExams,
      upcomingExams,
      pastExams,
    },
  };
});
