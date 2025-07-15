import { v4 as uuidv4 } from "uuid";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { question, options, subject, difficulty, examId, explain, order } =
    body;

  if (!question || !options || !subject || !examId) {
    return {
      statusCode: 400,
      message: "Required fields are missing",
    };
  }

  try {
    const questionId = uuidv4();
    
    // Create the question
    await query(
      `INSERT INTO free_exam_questions (id, question, subject, difficulty, exam_id, explain, "order", extra) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [questionId, question, subject, difficulty || "Medium", examId, explain, order || 0, false]
    );

    // Create the options
    for (const option of options) {
      const optionId = uuidv4();
      await query(
        `INSERT INTO free_exam_question_options (id, option_text, correct, question_id) 
         VALUES ($1, $2, $3, $4)`,
        [optionId, option.option_text, option.correct, questionId]
      );
    }

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
