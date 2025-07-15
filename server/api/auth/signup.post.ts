import { zh } from "h3-zod";
import { RegisterSchema } from "~/schema/register.schema";
import { createSession, serialiseSession } from "../../services/auth.service";
import { User } from "../../types";

export default defineEventHandler(async (event) => {
  const { data, error } = await zh.useSafeValidatedBody(event, RegisterSchema);

  if (error) {
    return {
      statusCode: 400,
      body: error,
    };
  }

  // check if user already exists
  let user = await query<User>("SELECT * FROM free_exam_users WHERE phone = $1", [data.phone]);
  if (!user.data || user.data.length === 0)  {
    user = await query<User>("INSERT INTO free_exam_users (name, phone, institute, level) VALUES ($1, $2, $3, $4) RETURNING *", [
    data.name,
    data.phone,
    data.institute,
    data.level,
  ]);
  }

  



  if (!user.data) {
    throw createError({
      statusCode: 400,
      statusMessage: "Failed to create user",
    });
  }

  const session = await createSession(user.data[0].id) as {id: string, user_id: string, expires_at: Date};
  appendHeader(event, "Set-Cookie", serialiseSession(session));
  return true;
});
