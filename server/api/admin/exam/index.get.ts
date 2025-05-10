export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);
  const exams = await db.exam.findMany({
    orderBy: {
      start_time: "desc",
    },
  });

  return {
    statusCode: 200,
    body: exams,
  };
});
