import { zh } from "h3-zod";
import { RegisterSchema } from "~/schema/register.schema";

export default defineEventHandler(async (event) => {
  const { data, error } = await zh.useSafeValidatedBody(event, RegisterSchema);

  if (error) {
    return {
      statusCode: 400,
      body: error,
    };
  }

  // email excluded

  const user = await db.user.upsert({
    where: { phone: data.phone },
    create: {
      name: data.name,
      phone: data.phone,
      district: data.district,
      thana: data.thana,
      institute: data.institute,
      batch: data.batch,
    },
    update: {
      name: data.name,
      district: data.district,
      thana: data.thana,
      institute: data.institute,
      batch: data.batch,
    },
  });
  const session = await lucia.createSession(user.id, {});
  appendHeader(
    event,
    "Set-Cookie",
    lucia.createSessionCookie(session.id).serialize()
  );
  return true;
});
