import { Question, Submission } from "~/server/types";

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

  const submission = await query<Submission>(
    `SELECT * FROM free_exam_submissions WHERE exam_id = $1 AND user_id = $2`,
    [id, userId]
  );

  let questions;

  // @ts-ignore
  const hardqs = (exam?.data?.hard as number) || 0;
  // @ts-ignore
  const mediumqs = (exam?.data?.medium as number) || 0;
  // @ts-ignore
  const easyqs = (exam?.data?.easy as number) || 0;

  questions = await query<Question[]>(
    `
    WITH difficulty_questions AS (
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
      GROUP BY q.id, q.question, q.difficulty
    )
    SELECT * FROM (
      SELECT * FROM difficulty_questions WHERE (difficulty = 'hard' OR difficulty = 'Hard') ORDER BY RANDOM() LIMIT $2
    ) hard_qs
    UNION ALL
    SELECT * FROM (
      SELECT * FROM difficulty_questions WHERE (difficulty = 'medium' OR difficulty = 'Medium') ORDER BY RANDOM() LIMIT $3
    ) medium_qs
    UNION ALL
    SELECT * FROM (
      SELECT * FROM difficulty_questions WHERE (difficulty = 'easy' OR difficulty = 'Easy') ORDER BY RANDOM() LIMIT $4
    ) easy_qs
    `,
    [id, hardqs, mediumqs, easyqs]
  );

  return {
    statusCode: 200,
    exam,
    questions: questions?.data,
  };
});
