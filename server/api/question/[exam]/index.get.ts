export default defineEventHandler(async (event) => {
  const id = event.context.params?.exam;
  const userId = event.context.user?.id;

  if (!userId || !id) {
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const exam = await db.exam.findUnique({
    where: { id: id },
  });

  if (!exam) {
    return createError({
      statusCode: 404,
      statusMessage: "Exam not found",
    });
  }

  if (
    new Date(exam.start_time) > new Date() ||
    new Date(exam.end_time) < new Date()
  ) {
    return createError({
      statusCode: 403,
      statusMessage: "Exam is not active",
    });
  }

  const questions = await db.question.findMany({
    where: { exam_id: id },
    include: {
      options: {
        select: {
          id: true,
          option_text: true,
        },
      },
      explain: false,
    },
  });

  let submission = await db.submission.findFirst({
    where: {
      exam_id: id,
      user_id: userId,
    },
  });

  if (submission && submission?.status !== "pending") {
    return createError({
      statusCode: 403,
      statusMessage: "Submission is not pending",
    });
  }

  if (!submission) {
    submission = await db.submission.create({
      data: {
        exam_id: id,
        user_id: userId,
        status: "pending",
      },
    });
  }

  return {
    statusCode: 200,
    exam,
    questions,
    submission,
  };
});
