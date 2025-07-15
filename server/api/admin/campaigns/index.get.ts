export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);
  
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
      status, total_exam, level, created_at, updated_at
    FROM free_exam_campaigns 
    ORDER BY created_at DESC
  `);

  return {
    statusCode: 200,
    body: campaigns.data || [],
  };
}); 