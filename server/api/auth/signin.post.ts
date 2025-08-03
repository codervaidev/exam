import { deleteOtherSessions, createSession, serialiseSession } from "../../services/auth.service";

export default eventHandler(async (event) => {
  const { phone } = await readBody(event);

  let existingUser = await query<{id: string}>("SELECT * FROM free_exam_users WHERE phone = $1", [
    phone,
  ]);

  if (!existingUser.data) {
    throw createError({
      statusMessage: "Incorrect phone or password",
      statusCode: 400,
    });
  }

 await deleteOtherSessions(existingUser.data[0].id);

      const session = await createSession(existingUser.data[0].id) as {id: string, user_id: string, expires_at: Date};

      appendHeader(event, "Set-Cookie", serialiseSession(session));

  return {
        session
      };
 
});
