export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    await processSubmission(body);
    return {
      statusCode: 200,
      statusMessage: "Processed successfully",
    };
  } catch (error) {
    console.error("Error processing submission:", error);
    return createError({
      statusCode: 500,
      statusMessage: "Failed to process submission",
    });
  }
});

const processSubmission = async (body: any) => {
  const { submission_id, answers } = body;

  const submission = await query<{
    id: string;
    created_at: string;
  }>(
    `
    SELECT * FROM free_exam_submissions WHERE id = $1
  `,
    [submission_id]
  );

  if (!submission || !submission.data || submission.data.length === 0) {
    return createError({
      statusCode: 404,
      statusMessage: "Submission not found",
    });
  }

  let duration =
    new Date().getTime() - new Date(submission.data[0].created_at).getTime();

  const marks = await query<{
    marks: number;
  }>(
    `
    SELECT COUNT(*) as marks FROM free_exam_question_options WHERE id IN (${answers.map((id: string) => `'${id}'`).join(",")}) AND correct = true
  `
  );

  if (!marks || !marks.data || marks.data.length === 0) {
    return createError({
      statusCode: 404,
      statusMessage: "Marks not found",
    });
  }

  const negMarks = (answers.length - marks?.data[0].marks) * 0.25;
  const totalMarks = marks?.data[0].marks - negMarks;

  await query(
    `
    UPDATE free_exam_submissions SET
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
      marks?.data[0]?.marks || 0,
      answers.length - (marks?.data[0]?.marks || 0),
      answers.length - (marks?.data[0]?.marks || 0),
      "submitted",
      submission.data[0].id,
    ]
  );
  return {
    statusCode: 200,
    statusMessage: "Submitted successfully",
  };
};
