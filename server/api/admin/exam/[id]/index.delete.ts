export default defineEventHandler(async (event) => {
  const examId = event.context.params?.id;

  await db.exam.delete({
    where: {
      id: examId,
    },
  });

  return {
    statusCode: 204,
    statusMessage: "Exam deleted successfully",
  };
});
