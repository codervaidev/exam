export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id;
  const userLevel = event.context.user?.level;

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const campaigns = await query<{
    id: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    status: string;
    total_exam: number;
    level: string;
    created_at: string;
    updated_at: string;
  }>(`
    SELECT 
      id, title, description, start_time, end_time, 
      status, level, created_at, updated_at,
      (SELECT COUNT(*) FROM free_exam_exams WHERE campaign_id = free_exam_campaigns.id) as total_exam
    FROM free_exam_campaigns 
    WHERE status = 'active' AND level = $1
    ORDER BY start_time ASC
  `, [userLevel]);



  return {
    statusCode: 200,
    body: campaigns.data,
  };
}); 