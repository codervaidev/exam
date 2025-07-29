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
    SET title = $1, subject = $2, yt_class_link = $3,
        start_time = $4, end_time = $5, duration = $6, total_marks = $7,
        result_publish_time = $8, solution_publish_time = $9,
        shuffle_questions = $10, negative_marking = $11, sequence_order = $12,
        updated_at = NOW()
    WHERE id = $13
    RETURNING id
  `, [
    data.title,
    data.subject,
    data.yt_class_link || null,
    new Date(data.startTime),
    new Date(data.endTime),
    data.duration,
    data.totalMarks,
    new Date(data.endTime),
    new Date(data.endTime),
    data.shuffleQuestions || false,
    data.negativeMarking || false,
    data.sequenceOrder || 1,
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
