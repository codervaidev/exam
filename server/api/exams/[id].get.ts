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
  return {
    statusCode: 200,
    exam
  };
});
