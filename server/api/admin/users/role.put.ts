export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);

  const { user_id, role } = await readBody(event);

  const userResult = await query<{id: string}>(
    `SELECT id FROM free_exam_users WHERE id = $1`,
    [user_id]
  );

  const user = userResult.data?.[0];

  if (!user) {
    return {
      statusCode: 404,
      body: "User not found",
    };
  }

  await query(
    `UPDATE free_exam_users SET role = $1, updated_at = $2 WHERE id = $3`,
    [role, new Date(), user_id]
  );

  return {
    statusCode: 200,
    statusMessage: "Role updated",
  };
});
