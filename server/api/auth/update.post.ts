export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id;

  const { address, tshirt } = await readBody(event);

  const user = await query(
    `UPDATE free_exam_users SET district = $1, thana = $2, updated_at = $3 WHERE id = $4 RETURNING *`,
    [address, tshirt, new Date(), userId]
  );

  return user.data?.[0];
});
