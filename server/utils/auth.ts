import { H3Event } from "h3";


export const validateRequest = (
  event: H3Event,
  roles: Role[] = ["ADMIN", "USER"]
) => {
  if (!event.context.user) {
    throw createError({
      statusMessage: "Unauthorized",
      statusCode: 401,
    });
  }

  // Check if the user's role is included in the allowed roles
  if (!roles.includes(event.context.user.role as "ADMIN" | "USER")) {
    throw createError({
      statusMessage: "Forbidden",
      statusCode: 403,
    });
  }
};
