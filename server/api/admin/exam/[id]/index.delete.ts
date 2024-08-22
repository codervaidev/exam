export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);
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
