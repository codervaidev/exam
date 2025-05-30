export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);
  const exams = await db.exam.findMany({
    orderBy: {
      start_time: "desc",
    },
  });

  // Get question counts by difficulty for each exam using raw SQL
  const questionCounts = await query<{
    exam_id: string;
    difficulty: string;
    count: number;
  }>(`
    SELECT exam_id, LOWER(difficulty) as difficulty, COUNT(*) as count 
    FROM questions 
    WHERE exam_id IN (${exams.map((e) => `'${e.id}'`).join(",")})
    GROUP BY exam_id, difficulty
  `);

  // Map the counts to each exam
  const examsWithCounts = exams.map((exam) => {
    const counts =
      questionCounts.data?.filter((q) => q.exam_id === exam.id) || [];
    const difficultyCounts = {
      easy: 0,
      medium: 0,
      hard: 0,
    };

    counts.forEach((count) => {
      difficultyCounts[count.difficulty as keyof typeof difficultyCounts] =
        count.count;
    });

    return {
      ...exam,
      question_counts: difficultyCounts,
    };
  });

  return {
    statusCode: 200,
    body: examsWithCounts,
  };
});
