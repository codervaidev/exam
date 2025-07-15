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
    const updatedQuestionResult = await query(
      `UPDATE free_exam_questions 
       SET question = $1, subject = $2, difficulty = $3, exam_id = $4, explain = $5 
       WHERE id = $6 
       RETURNING *`,
      [question, subject, difficulty || "Medium", examId, explain, questionId]
    );

    const updatedQuestion = updatedQuestionResult.data?.[0];

    // Update the options
    await Promise.all(
      options.map(async (option: any) => {
        if (option.id && option.type == "update") {
          // Update existing option
          await query(
            `UPDATE free_exam_question_options 
             SET option_text = $1, correct = $2 
             WHERE id = $3`,
            [option.option_text, option.correct, option.id]
          );
        } else if (option.type == "delete") {
          await query(
            `DELETE FROM free_exam_question_options WHERE id = $1`,
            [option.id]
          );
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
