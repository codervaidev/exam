export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);
  const body = await readBody(event);

  const { title, description, startTime, endTime, level } = body;

  if (!title || !description || !startTime || !endTime || !level) {
    throw createError({
      statusCode: 400,
      statusMessage: "All fields are required"
    });
  }

  const result = await query(`
    INSERT INTO free_exam_campaigns (title, description, start_time, end_time, level)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `, [title, description, new Date(startTime), new Date(endTime), level]);

  if (!result.success) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create campaign"
    });
  }

  return {
    statusCode: 201,
    statusMessage: "Campaign created successfully",
    data: result.data?.[0]
  };
}); 