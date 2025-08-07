import { query } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id;

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    });
  }

  const { name, institute } = await readBody(event);

  // Validate that at least one field is provided
  if (!name && !institute) {
    throw createError({
      statusCode: 400,
      statusMessage: "At least one field (name or institute) must be provided"
    });
  }

  // Build dynamic query based on provided fields
  let sqlquery = "UPDATE free_exam_users SET updated_at = $1";
  let params = [new Date()];
  let paramIndex = 2;

  if (name) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Name cannot be empty"
      });
    }
    sqlquery += `, name = $${paramIndex}`;
    params.push(name.trim());
    paramIndex++;
  }

  if (institute) {
    if (typeof institute !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: "Institute must be a string"
      });
    }
    sqlquery += `, institute = $${paramIndex}`;
    params.push(institute.trim());
    paramIndex++;
  }

  sqlquery += ` WHERE id = $${paramIndex} RETURNING *`;
  params.push(userId);

  const result = await query(sqlquery, params);

  if (!result.success || !result.data?.length) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found or update failed"
    });
  }

  return result.data[0];
}); 