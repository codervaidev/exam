import { v4 as uuidv4 } from "uuid";

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

  const cacheKey = `questions:${id}`;
  const cachedQuestions = await getCache(cacheKey);

  let questions;
  if (cachedQuestions) {
    questions = cachedQuestions;
  } else {
    questions = await query<{
      id: string;
      question: string;
      options: {
        id: string;
        option_text: string;
      }[];
    }>(
      `
    SELECT 
      q.id,
      q.question,
      json_agg(
        json_build_object(
          'id', o.id,
          'option_text', o.option_text
        )
      ) as options
    FROM questions q
    LEFT JOIN question_options o ON q.id = o.question_id
    WHERE q.exam_id = $1
    GROUP BY q.id, q.question
  `,
      [id]
    );
  }

  let submission = await query<{
    id: string;
    user_id: string;
    exam_id: string;
    status: string;
    created_at: string;
  }>(`SELECT * FROM submissions WHERE exam_id = $1 AND user_id = $2`, [
    id,
    userId,
  ]);

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
    submission = await query<{
      id: string;
      user_id: string;
      exam_id: string;
      status: string;
      created_at: string;
      updated_at: string;
    }>(
      `INSERT INTO submissions (id,exam_id, user_id, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5,$6) RETURNING *`,
      [uuidv4(), id, userId, "pending", new Date(), new Date()]
    );
  }

  return {
    statusCode: 200,
    exam,
    questions: questions?.data,
    // @ts-ignore
    submission: submission?.data[0],
  };
});
