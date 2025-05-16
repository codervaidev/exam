export default defineEventHandler(async (event) => {
  const exams = await db.exam.findMany({
    include: {
      submissions: {
        where: {
          user_id: event.context.user?.id,
        },
        select: {
          id: true,
          status: true,
          marks: true,
          duration: true,
          submitted_at: true,
        },
      },
    },
    orderBy: {
      start_time: "asc",
    },
  });

  const currentDate = new Date();

  const examsWithStatus = exams.map((exam) => {
    let status = "";

    if (currentDate < new Date(exam.start_time)) {
      status = "upcoming";
    } else if (
      currentDate >= new Date(exam.start_time) &&
      currentDate <= new Date(exam.end_time)
    ) {
      status = "ongoing";
    } else if (currentDate > new Date(exam.start_time)) {
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
  const pastExams = examsWithStatus
    .filter((e) => e.status === "past")
    .reverse();

  return {
    statusCode: 200,
    body: {
      ongoingExams,
      upcomingExams: [...upcomingExams, ...pastExams],
    },
  };
});
