export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { question, options, subject, difficulty, examId, explain } = body;

  if (!question || !options || !subject || !examId) {
    return {
      statusCode: 400,
      message: "Required fields are missing",
    };
  }

  try {
    await db.question.create({
      data: {
        question,
        subject,
        difficulty: difficulty || "Medium",
        examId,
        explain,
        options: {
          create: options.map((option) => ({
            option_text: option.option_text,
            correct: option.correct,
          })),
        },
      },
    });

    return {
      statusCode: 201,
      message: "Question created successfully",
    };
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return createError({
      statusCode: 500,
      statusMessage: "An error occurred while creating the question",
    });
  }
});
