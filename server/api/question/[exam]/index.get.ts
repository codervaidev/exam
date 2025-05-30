import { v4 as uuidv4 } from "uuid";
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

  const exam = await db.exam.findUnique({
    where: { id: id },
  });

  if (!exam) {
    return createError({
      statusCode: 404,
      statusMessage: "Exam not found",
    });
  }

  if (
    new Date(exam.start_time) > new Date() ||
    new Date(exam.end_time) < new Date()
  ) {
    return createError({
      statusCode: 403,
      statusMessage: "Exam is not active",
    });
  }

  // @ts-ignore
  const hardqs = (exam?.data?.hard as number) || 0;
  // @ts-ignore
  const mediumqs = (exam?.data?.medium as number) || 0;
  // @ts-ignore
  const easyqs = (exam?.data?.easy as number) || 0;

  let submission = await query<Submission>(
    `SELECT * FROM submissions WHERE exam_id = $1 AND user_id = $2 AND status = 'pending'`,
    [id, userId]
  );

 
  let questions;

  if (
    submission &&
    submission.data &&
    submission.data.length > 0 &&
    submission.data[0]?.status === "pending"
  ) {
    questions = await query<Question[]>(
      `SELECT  q.id,
        q.question,
        q.subject,
        q.difficulty,
        json_agg(
          json_build_object(
            'id', o.id,
            'option_text', o.option_text
          )
        ) as options FROM questions q  LEFT JOIN question_options o ON q.id = o.question_id
         WHERE q.id IN (${submission.data[0].questions.map((q) => `'${q}'`).join(",")})
         GROUP BY q.id, q.question, q.subject, q.difficulty
         `
    );
  } else {
    questions = await query<Question[]>(
      `
    WITH difficulty_questions AS (
      SELECT 
        q.id,
        q.question,
        q.subject,
        q.difficulty,
        json_agg(
          json_build_object(
            'id', o.id,
            'option_text', o.option_text
          )
        ) as options
      FROM questions q
      LEFT JOIN question_options o ON q.id = o.question_id
      WHERE q.exam_id = $1
      GROUP BY q.id, q.question, q.subject, q.difficulty
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
  }

  if (
    submission &&
    submission.data &&
    submission.data.length > 0 &&
    submission.data[0]?.status !== "pending"
  ) {
    return createError({
      statusCode: 403,
      statusMessage: "Submission is not pending",
    });
  }

  if (!submission || !submission.data || submission.data.length === 0) {
    // @ts-ignore
    let qsIds = questions.data?.map((q: Question) => `${q.id}`);
    // @ts-ignore
    submission = await db.submission.create({
      data: {
        id: uuidv4(),
        exam_id: id,
        user_id: userId,
        questions: qsIds,
        status: "pending",
      },
    });

    submission = await query<Submission>(
      `UPDATE submissions SET created_at = $1, updated_at = $2 WHERE id = $3 RETURNING *`,
      // @ts-ignore
      [new Date(), new Date(), submission.id]
    );
  }

  if (exam.shuffle_questions && questions?.data) {
    questions.data = questions.data.sort(() => Math.random() - 0.5);
  }

  return {
    statusCode: 200,
    exam,
    questions: questions?.data,
    // @ts-ignore
    submission: submission?.data[0],
  };
});
