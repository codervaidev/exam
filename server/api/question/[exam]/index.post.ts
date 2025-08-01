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
    questions: string[];
  }>(`SELECT * FROM free_exam_submissions WHERE id = $1`, [submission_id]);

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
  }>(`SELECT negative_marking FROM free_exam_exams WHERE id = $1`, [id]);

  if (!exam || !exam.data || exam.data.length === 0) {
    return createError({
      statusCode: 404,
      statusMessage: "Exam not found",
    });
  }
  let marks = await query<{
    marks: number;
  }>(
    `
    SELECT COUNT(*) as marks FROM free_exam_question_options WHERE id IN ('${answers.join("','")}') AND correct = true
  `
  );

  if (!marks || !marks.data || marks.data.length === 0) {
    marks = {
      data: [{ marks: 0 }],
      success: true,
      count: 0,
    };
  }

  const negMarks = (answers.length - (marks.data?.[0]?.marks || 0)) * 0.25;
  const totalMarks = exam.data[0].negative_marking
    ? (marks.data?.[0]?.marks || 0) - negMarks
    : (marks.data?.[0]?.marks || 0);

  const skipped = submission.data[0].questions.length - answers.length || 0;

  await query(
    `UPDATE
    free_exam_submissions SET
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
      marks.data?.[0]?.marks || 0,
      answers.length - (marks.data?.[0]?.marks || 0),
      skipped,
      "submitted",
      submission.data[0].id,
    ]
  );
  return {
    statusCode: 200,
    statusMessage: "Submitted successfully",
  };
});
