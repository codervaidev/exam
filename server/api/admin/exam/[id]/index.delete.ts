export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);
  const id = event.context.params?.id;
  // Delete related options and questions
  const questions = await db.question.findMany({
    where: {
      examId: id,
    },
    select: {
      id: true,
    },
  });

  const questionIds = questions.map((q) => q.id);

  await db.option.deleteMany({
    where: {
      questionId: {
        in: questionIds,
      },
    },
  });

  await db.question.deleteMany({
    where: {
      examId: id,
    },
  });

  // Delete related submissions
  await db.submission.deleteMany({
    where: {
      examId: id,
    },
  });

  // Delete the exam
  await db.exam.delete({
    where: { id },
  });

  return {
    statusCode: 204,
    statusMessage: "Exam deleted successfully",
  };
});
