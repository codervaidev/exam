export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);
  const campaignId = event.context.params?.id;

  if (!campaignId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Campaign ID is required"
    });
  }

  // Check if there are exams associated with this campaign
  const examCheck = await query<{ count: number }>(`
    SELECT COUNT(*) as count 
    FROM free_exam_exams 
    WHERE campaign_id = $1
  `, [campaignId]);

  if ((examCheck.data?.[0]?.count ?? 0) > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Cannot delete campaign with associated exams"
    });
  }

  const result = await query(`
    DELETE FROM free_exam_campaigns 
    WHERE id = $1
    RETURNING id
  `, [campaignId]);

  if (!result.success || !result.data?.length) {
    throw createError({
      statusCode: 404,
      statusMessage: "Campaign not found"
    });
  }

  return {
    statusCode: 204,
    statusMessage: "Campaign deleted successfully"
  };
}); 