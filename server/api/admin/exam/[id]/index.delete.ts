export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);
  const id = event.context.params?.id;
  // Delete related options and questions
  const questions = await db.question.findMany({
    where: {
      exam_id: id,
    },
    select: {
      id: true,
    },
  });

  const questionIds = questions.map((q) => q.id);

  await db.option.deleteMany({
    where: {
      question_id: {
        in: questionIds,
      },
    },
  });

  await db.question.deleteMany({
    where: {
      exam_id: id,
    },
  });

  // Delete related submissions
  await db.submission.deleteMany({
    where: {
      exam_id: id,
    },
  });

  // Delete the exam
  await db.exam.delete({
    where: { id: id },
  });

  return {
    statusCode: 204,
    statusMessage: "Exam deleted successfully",
  };
});
