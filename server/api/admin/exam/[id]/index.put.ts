import { zh } from "h3-zod";
import { ExamSchema } from "~/schema/exam.schema";

export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);
  const { data, error } = await zh.useSafeValidatedBody(event, ExamSchema);

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.issues?.[0]?.message || "Validation error"
    });
  }

  const examId = event.context.params?.id;

  if (!examId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Exam ID is required"
    });
  }

  const result = await query(`
    UPDATE free_exam_exams 
    SET title = $1, subject = $2, level = $3, campaign_id = $4,
        start_time = $5, end_time = $6, duration = $7, total_marks = $8,
        result_publish_time = $9, solution_publish_time = $10,
        shuffle_questions = $11, negative_marking = $12,
        updated_at = NOW()
    WHERE id = $13
    RETURNING id
  `, [
    data.title,
    data.subject,
    data.level,
    data.campaignId,
    new Date(data.startTime),
    new Date(data.endTime),
    data.duration,
    data.totalMarks,
    new Date(data.resultPublishTime),
    new Date(data.solutionPublishTime),
    data.shuffleQuestions || false,
    data.negativeMarking || false,
    examId
  ]);

  if (!result.success || !result.data?.length) {
    throw createError({
      statusCode: 404,
      statusMessage: "Exam not found or update failed"
    });
  }

  return {
    statusCode: 200,
    statusMessage: "Exam updated successfully",
  };
});
