export default defineEventHandler(async (event) => {
  const id = event.context.params?.exam;
  const userId = event.context.user?.id;

  if (!userId || !id) {
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const { submission_id, answers } = await readBody(event);

  const submission = await query<{
    id: string;
    created_at: string;
  }>(`SELECT * FROM submissions WHERE id = $1`, [submission_id]);

  if (!submission || !submission.data || submission.data.length === 0) {
    return createError({
      statusCode: 404,
      statusMessage: "Submission not found",
    });
  }

  let duration =
    new Date().getTime() - new Date(submission.data[0].created_at).getTime();

  const exam = await query<{
    negative_marking: boolean;
  }>(`SELECT negative_marking FROM exams WHERE id = $1`, [id]);

  if (!exam || !exam.data || exam.data.length === 0) {
    return createError({
      statusCode: 404,
      statusMessage: "Exam not found",
    });
  }
  const marks = await query<{
    marks: number;
  }>(
    `
    SELECT COUNT(*) as marks FROM question_options WHERE id IN (${answers.map((id: string) => `'${id}'`).join(",")}) AND correct = true
  `
  );

  if (!marks || !marks.data || marks.data.length === 0) {
    return createError({
      statusCode: 404,
      statusMessage: "Marks not found",
    });
  }

  const negMarks = (answers.length - marks?.data[0].marks) * 0.25;
  const totalMarks = exam.data[0].negative_marking
    ? marks?.data[0].marks - negMarks
    : marks?.data[0].marks;

  await query(
    `UPDATE
    submissions SET
      answers = $1,
      duration = $2,
      submitted_at = $3,
      marks = $4,
      correct = $5,
      incorrect = $6,
      skipped = $7,
      status = $8
    WHERE id = $9
  `,
    [
      answers,
      duration,
      new Date(),
      totalMarks,
      marks?.data[0].marks,
      answers.length - marks?.data[0].marks,
      answers.length - marks?.data[0].marks,
      "submitted",
      submission.data[0].id,
    ]
  );
  return {
    statusCode: 200,
    statusMessage: "Submitted successfully",
  };
});
