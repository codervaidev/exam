export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const questionId = event.context.params?.id;

  try {
    // Delete options first (due to foreign key constraint)
    await query(
      `DELETE FROM free_exam_question_options WHERE question_id = $1`,
      [questionId]
    );

    // Delete the question
    await query(
      `DELETE FROM free_exam_questions WHERE id = $1`,
      [questionId]
    );

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
