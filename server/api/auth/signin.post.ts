export default eventHandler(async (event) => {
  const { phone } = await readBody(event);

  let existingUser = await db.user.findUnique({
    where: { phone },
  });

  if (!existingUser) {
    throw createError({
      statusMessage: "Incorrect phone or password",
      statusCode: 400,
    });
  }

  const session = await lucia.createSession(existingUser.id, {});
  appendHeader(
    event,
    "Set-Cookie",
    lucia.createSessionCookie(session.id).serialize()
  );
  return true;
});
