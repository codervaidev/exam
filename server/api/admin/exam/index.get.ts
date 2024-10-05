export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);
  const exams = await db.exam.findMany({
    orderBy: {
      startTime: "desc",
    },
  });

  return {
    statusCode: 200,
    body: exams,
  };
});
