export default defineEventHandler(async (event) => {
  const id = event.context.params?.exam;
  const userId = event.context.user?.id;

  if (!userId || !id) {
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const examResult = await query<{
    id: string;
    title: string;
    subject: string;
    level: string;
    start_time: string;
    end_time: string;
    duration: number;
    data: any;
  }>(`SELECT * FROM free_exam_exams WHERE id = $1`, [id]);

  const exam = examResult.data?.[0];

  if (!exam) {
    return createError({
      statusCode: 404,
      statusMessage: "Exam not found",
    });
  }

  let submissionResult = await query<{
    id: string;
    user_id: string;
    exam_id: string;
    answers: string[];
    questions: string[];
    attempt: number;
    marks: number;
    correct: number;
    incorrect: number;
    skipped: number;
    duration: number;
    status: string;
    submitted_at: string;
    created_at: string;
    updated_at: string;
  }>(`SELECT * FROM free_exam_submissions WHERE exam_id = $1 AND user_id = $2 LIMIT 1`, [id, userId]);

  let submission = submissionResult.data?.[0];

  const questionsResult = await query<{
    id: string;
    question: string;
    subject: string;
    difficulty: string;
    explain: string;
    options: Array<{
      id: string;
      option_text: string;
      correct: boolean;
    }>;
  }>(`
    SELECT 
      q.id,
      q.question,
      q.subject,
      q.difficulty,
      q.explain,
      json_agg(
        json_build_object(
          'id', o.id,
          'option_text', o.option_text,
          'correct', o.correct
        )
      ) as options
    FROM free_exam_questions q
    LEFT JOIN free_exam_question_options o ON q.id = o.question_id
    WHERE q.exam_id = $1
    GROUP BY q.id, q.question, q.subject, q.difficulty, q.explain
  `, [id]);

  const questions = questionsResult.data || [];

  return {
    statusCode: 200,
    exam,
    questions,
    submission,
  };
});
