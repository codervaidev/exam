export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const questionId = event.context.params?.id;

  try {
    await db.option.deleteMany({
      where: { questionId: questionId },
    });

    await db.question.delete({
      where: { id: questionId },
    });

    return {
      statusCode: 200,
      message: "Question deleted successfully",
    };
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return createError({
      statusCode: 500,
      statusMessage: "An error occurred while deleting the question",
    });
  }
});
