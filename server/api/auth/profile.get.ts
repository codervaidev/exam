export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id;

  const submissions = await db.submission.findMany({
    where: {
      user_id: userId,
      status: "submitted",
    },

    select: {
      exam: {
        select: {
          title: true,
          duration: true,
        },
      },
      marks: true,
      duration: true,
      correct: true,
      incorrect: true,
      skipped: true,
    },
  });

  return submissions;
});
