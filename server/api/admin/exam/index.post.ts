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

  // Get the next sequence order for this campaign
  const sequenceResult = await query<{
    next_sequence: number
  }>(`
    SELECT COALESCE(MAX(sequence_order), 0) + 1 as next_sequence
    FROM free_exam_exams
  `);

  const nextSequence = sequenceResult.data?.[0]?.next_sequence || 1;

  const result = await query(`
    INSERT INTO free_exam_exams (
      title, subject, start_time, end_time,
      duration, total_marks, result_publish_time, solution_publish_time,
      shuffle_questions, negative_marking, sequence_order,yt_class_link
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING id
  `, [
    data.title,
    data.subject,
    new Date(data.startTime),
    new Date(data.endTime),
    data.duration,
    data.totalMarks,
    new Date(data.endTime),
    new Date(data.endTime),
    data.shuffleQuestions || false,
    data.negativeMarking || false,
    data.sequenceOrder || nextSequence,
    data.yt_class_link || null
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
