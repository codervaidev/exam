export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);
  const campaignId = event.context.params?.id;
  const body = await readBody(event);

  const { title, description, startTime, endTime, status, level } = body;

  if (!campaignId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Campaign ID is required"
    });
  }

  const result = await query(`
    UPDATE free_exam_campaigns 
    SET title = $1, description = $2, start_time = $3, end_time = $4, 
        status = $5, level = $6, updated_at = NOW()
    WHERE id = $7
    RETURNING id
  `, [title, description, new Date(startTime), new Date(endTime), status, level, campaignId]);

  if (!result.success || !result.data?.length) {
    throw createError({
      statusCode: 404,
      statusMessage: "Campaign not found or update failed"
    });
  }

  return {
    statusCode: 200,
    statusMessage: "Campaign updated successfully"
  };
}); 