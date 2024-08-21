export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  const exam = await db.exam.findUnique({
    where: { id: id },
  });

  if (!exam) {
    return createError({
      statusCode: 404,
      statusMessage: "Exam not found",
    });
  }

  const questions = await db.question.findMany({
    where: { examId: id },
    include: {
      options: true,
    },
  });
  return {
    statusCode: 200,
    body: {
      exam,
      questions,
    },
  };
});
