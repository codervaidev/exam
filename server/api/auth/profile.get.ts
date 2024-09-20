export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id;

  const submissions = await db.submission.findMany({
    where: {
      userId,
      status: "submitted",
    },

    select: {
      exam: {
        select: {
              title: true,
            duration: true
        },
      },
      marks: true,
      duration: true,
    },
  });

  return submissions;
});
