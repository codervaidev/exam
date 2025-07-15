export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  const examResult = await query<{
    id: string;
    title: string;
    subject: string;
    level: string;
    campaign_id: string;
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
  }>(`SELECT * FROM free_exam_exams WHERE id = $1`, [id]);

  const exam = examResult.data?.[0];

  if (!exam) {
    return createError({
      statusCode: 404,
      statusMessage: "Exam not found",
    });
  }
  return {
    statusCode: 200,
    exam
  };
});
