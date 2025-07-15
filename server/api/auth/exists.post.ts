export default defineEventHandler(async (event) => {
  const { phone } = await readBody(event);
  const existingUser = await query<{id: string}>(
    `SELECT id FROM free_exam_users WHERE phone = $1`, 
    [phone]
  );

  if (!existingUser.data || existingUser.data.length === 0) {
    throw createError({
      statusMessage: "Incorrect phone or password",
      statusCode: 400,
    });
  }
  return true;
});
