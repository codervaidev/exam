export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);

  const { user_id, role } = await readBody(event);

  const user = await db.user.findUnique({
    where: { id: user_id },
  });

  if (!user) {
    return {
      statusCode: 404,
      body: "User not found",
    };
  }

  await db.user.update({
    where: { id: user_id },
    data: {
      role,
    },
  });

  return {
    statusCode: 200,
    statusMessage: "Role updated",
  };
});
