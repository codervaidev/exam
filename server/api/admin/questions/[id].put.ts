export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { question, options, subject, difficulty, examId, explain } = body;

  const questionId = event.context.params?.id;

  if (!question || !options || !subject || !examId) {
    return {
      statusCode: 400,
      message: "Required fields are missing",
    };
  }

  try {
    // Update the question details
    const updatedQuestion = await db.question.update({
      where: { id: questionId },
      data: {
        question,
        subject,
        difficulty: difficulty || "Medium",
        exam_id: examId,
        explain,
      },
    });

    // Update the options
    await Promise.all(
      options.map(async (option) => {
        if (option.id && option.type == "update") {
          // Update existing option
          await db.option.update({
            where: { id: option.id },
            data: {
              option_text: option.option_text,
              correct: option.correct,
            },
          });
        } else if (option.type == "delete") {
          await db.option.delete({
            where: { id: option.id },
          });
        }
      })
    );

    return {
      statusCode: 200,
      message: "Question updated successfully",
      data: updatedQuestion,
    };
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return createError({
      statusCode: 500,
      statusMessage: "An error occurred while updating the question",
    });
  }
});
