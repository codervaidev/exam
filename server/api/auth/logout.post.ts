import { invalidateSession } from "~/server/services/auth.service";

export default eventHandler(async (event) => {
  if (!event.context.session) {
    throw createError({
      statusCode: 403,
    });
  }
  await invalidateSession(event.context.session.id);
  appendHeader(
    event,
    "Set-Cookie",
    `auth_session=; Max-Age=0; Path=/`
  );

  return true;
});
