export default defineEventHandler(async (event) => {
  const exams = await db.exam.findMany({
    orderBy: {
      startTime: "asc",
    },
  });

  return {
    statusCode: 200,
    body: exams,
  };
});
