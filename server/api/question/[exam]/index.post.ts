export default defineEventHandler(async (event) => {
  const id = event.context.params?.exam;
  const userId = event.context.user?.id;

  const { answers } = await readBody(event);

  if (!userId || !id) {
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  let submission = await db.submission.findFirst({
    where: {
      examId: id,
      userId: userId,
      status: "pending",
    },
  });

  if (!submission) {
    return createError({
      statusCode: 404,
      statusMessage: "Submission not found",
    });
  }

  let duration =
    new Date(submission?.createdAt).getTime() - new Date().getTime();

  await db.submission.update({
    where: {
      id: submission.id,
    },
    data: {
      answers,
      duration,
      submittedAt: new Date(),
      status: "submitted",
    },
  });

  return {
    statusCode: 200,
    statusMessage: "Submitted successfully",
  };
});
