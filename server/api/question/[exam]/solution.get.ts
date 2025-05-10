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

  let submission = await db.submission.findFirst({
    where: {
      exam_id: id,
      user_id: userId,
    },

    select: {
      answers: true,
    },
  });

  const questions = await db.question.findMany({
    where: { examId: id },

    include: {
      options: {
        select: {
          id: true,
          option_text: true,
          correct: true,
        },
      },
    },
  });

  submission =
    // @ts-ignore
    submission && submission?.answers ? submission.answers : [];

  return {
    statusCode: 200,
    exam,
    questions,
    submission,
  };
});
