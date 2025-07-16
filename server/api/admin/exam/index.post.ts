import { zh } from "h3-zod";
import { ExamSchema } from "~/schema/exam.schema";

export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);
  const { data, error } = await zh.useSafeValidatedBody(event, ExamSchema);

  if (error) {
    console.log(error)
    throw createError({
      statusCode: 400,
      statusMessage: error.issues?.[0]?.message || "Validation error"
    });
  }

  const result = await query(`
    INSERT INTO free_exam_exams (
      title, subject, level, campaign_id, start_time, end_time,
      duration, total_marks, result_publish_time, solution_publish_time,
      shuffle_questions, negative_marking
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
    new Date(data.endTime),
    new Date(data.endTime),
    data.shuffleQuestions || false,
    data.negativeMarking || false
  ]);

  if (!result.success) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create exam"
    });
  }

  return {
    statusCode: 201,
    statusMessage: "Exam created successfully",
    data: result.data?.[0]
  };
});
