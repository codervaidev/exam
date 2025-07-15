export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);
  const id = event.context.params?.id;

  const exam = await query('SELECT * FROM free_exam_exams WHERE id = $1', [id]);

  if (!exam.data || !exam.data[0]) {
    return createError({
      statusCode: 404,
      statusMessage: "Exam not found",
    });
  }

  const questions = await query(
    `SELECT  q.id,
        q.question,
        q.subject,
        q.difficulty,
        json_agg(
          json_build_object(
            'id', o.id,
            'option_text', o.option_text,
            'correct', o.correct
          )
        ) as options FROM free_exam_questions q  LEFT JOIN free_exam_question_options o ON q.id = o.question_id
         WHERE q.exam_id = $1
         GROUP BY q.id, q.question, q.subject, q.difficulty`,
    [id]
  );

  
  return {
    statusCode: 200,
    body: {
      exam: exam.data[0],
      questions: questions.data,
    },
  };
});
