export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);
  // delete submission
  const id = event.context.params?.id;

  const submissionResult = await query<{id: string}>(
    `SELECT id FROM free_exam_submissions WHERE id = $1`,
    [id as string]
  );

  const submission = submissionResult.data?.[0];

  if (!submission) {
    return {
      status: 404,
      body: {
        message: "Submission not found",
      },
    };
  }

  await query(
    `DELETE FROM free_exam_submissions WHERE id = $1`,
    [id as string]
  );

  return {
    status: 200,
    body: {
      message: "Submission deleted successfully",
    },
  };
});
