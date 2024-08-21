export default defineEventHandler(async (event) => {
  const exams = await db.exam.findMany({});

  return {
    statusCode: 200,
    body: exams,
  };
});
