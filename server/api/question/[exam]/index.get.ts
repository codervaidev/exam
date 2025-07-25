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

  const examResult = await query<{
    id: string;
    title: string;
    subject: string;
    level: string;
    start_time: string;
    end_time: string;
    duration: number;
    shuffle_questions: boolean;
    data: any;
  }>(`SELECT * FROM free_exam_exams WHERE id = $1`, [id]);

  const exam = examResult.data?.[0];

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

 
  let submission = await query<Submission>(
    `SELECT * FROM free_exam_submissions WHERE exam_id = $1 AND user_id = $2`,
    [id, userId]
  );

  if (
    submission &&
    submission.data &&
    submission.data.length > 0 &&
    submission.data[0]?.status !== "pending"
  ) {
    return createError({
      statusCode: 403,
      statusMessage: "Submission already exists",
    });
  }

  let questions = await query<Question[]>(
      `
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
      FROM free_exam_questions q
      LEFT JOIN free_exam_question_options o ON q.id = o.question_id
      WHERE q.exam_id = $1
      GROUP BY q.id, q.question, q.subject, q.difficulty
    
    `,
      [id]
    );

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
    const submissionId = uuidv4();
    
    submission = await query<Submission>(
      `INSERT INTO free_exam_submissions (id, exam_id, user_id, questions, status, answers, attempt, marks, correct, incorrect, skipped, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [submissionId, id, userId, qsIds, "pending", [], 1, 0, 0, 0, 0, new Date(), new Date()]
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
