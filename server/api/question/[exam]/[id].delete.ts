export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);
  // delete submission
  const { id } = event.context.params;

  const submission = await db.submission.findUnique({
    where: {
      id: id as string,
    },
  });

  if (!submission) {
    return {
      status: 404,
      body: {
        message: "Submission not found",
      },
    };
  }

  await db.submission.delete({
    where: {
      id: id as string,
    },
  });

  return {
    status: 200,
    body: {
      message: "Submission deleted successfully",
    },
  };
});
