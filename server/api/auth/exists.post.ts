export default defineEventHandler(async (event) => {
  const { phone } = await readBody(event);
  const existingUser = await db.user.findUnique({
    where: { phone },
  });

  if (!existingUser) {
    throw createError({
      statusMessage: "Incorrect phone or password",
      statusCode: 400,
    });
  }
  return true;
});
