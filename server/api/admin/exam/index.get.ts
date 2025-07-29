export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);
  
  // Get exams with campaign information using raw SQL
  const exams = await query<{
    id: string;
    title: string;
    subject: string;
    campaign_title: string;
    sequence_order: number;
    start_time: string;
    end_time: string;
    duration: number;
    total_marks: number;
    result_publish_time: string;
    solution_publish_time: string;
    shuffle_questions: boolean;
    negative_marking: boolean;
    data: any;
    created_at: string;
    updated_at: string;
  }>(`
    SELECT 
      e.id, e.title, e.subject,
      e.sequence_order,
      e.start_time, e.end_time, e.duration, e.total_marks,
      e.result_publish_time, e.solution_publish_time,
      e.shuffle_questions, e.negative_marking, e.data,
      e.created_at, e.updated_at
    FROM free_exam_exams e
    ORDER BY e.sequence_order ASC, e.start_time DESC
  `);

  if (!exams.success) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch exams"
    });
  }

  // Get question counts by difficulty for each exam using raw SQL
  const examIds = exams.data?.map(e => e.id) || [];
  let questionCounts: { data: Array<{ exam_id: string; difficulty: string; count: number; }> | null } = { data: [] };
  
  if (examIds.length > 0) {
    questionCounts = await query<{
      exam_id: string;
      difficulty: string;
      count: number;
    }>(`
      SELECT exam_id, LOWER(difficulty) as difficulty, COUNT(*) as count 
      FROM free_exam_questions 
      WHERE exam_id = ANY($1)
      GROUP BY exam_id, difficulty
    `, [examIds]);
  }

  // Map the counts to each exam
  const examsWithCounts = exams.data?.map((exam) => {
    const counts =
      questionCounts.data?.filter((q) => q.exam_id === exam.id) || [];
    const difficultyCounts = {
      easy: 0,
      medium: 0,
      hard: 0,
    };

    counts.forEach((count) => {
      difficultyCounts[count.difficulty as keyof typeof difficultyCounts] =
        Number(count.count);
    });

    return {
      ...exam,
      question_counts: difficultyCounts,
    };
  }) || [];

  return {
    statusCode: 200,
    body: examsWithCounts,
  };
});
