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
    new Date().getTime() - new Date(submission?.createdAt).getTime();

  const optionIds = answers.map((a) => a.a);

  const marks = await db.option.count({
    where: {
      id: {
        in: optionIds,
      },
      correct: true,
    },
  });

  const negMarks = (optionIds.length - marks) * 0.25;

  await db.submission.update({
    where: {
      id: submission.id,
    },
    data: {
      answers,
      duration,
      submittedAt: new Date(),
      marks: marks - negMarks,
      status: "submitted",
    },
  });

  return {
    statusCode: 200,
    statusMessage: "Submitted successfully",
  };
});
