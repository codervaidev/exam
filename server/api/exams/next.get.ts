import { getNextAvailableExam } from "~/server/utils/exam";

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id;
  const campaignId = getQuery(event).campaign;

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  if (!campaignId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Campaign ID is required",
    });
  }

  const nextExamId = await getNextAvailableExam(userId, campaignId as string);

  if (!nextExamId) {
    return {
      statusCode: 200,
      body: {
        nextExam: null,
        message: "All exams in this campaign have been completed"
      }
    };
  }

  // Get the exam details
  const examResult = await query<{
    id: string;
    title: string;
    subject: string;
    sequence_order: number;
    start_time: string;
    end_time: string;
    duration: number;
    total_marks: number;
  }>(`
    SELECT id, title, subject, sequence_order, start_time, end_time, duration, total_marks
    FROM free_exam_exams 
    WHERE id = $1
  `, [nextExamId]);

  const exam = examResult.data?.[0];

  if (!exam) {
    throw createError({
      statusCode: 404,
      statusMessage: "Next exam not found",
    });
  }

  return {
    statusCode: 200,
    body: {
      nextExam: exam
    }
  };
});