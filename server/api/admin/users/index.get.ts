export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const users = await db.user.findMany({
    skip,
    take: limit,
    include: {
      sessions: true,
    },
  });

  const totalUsers = await db.user.count();

  return {
    page,
    limit,
    totalPages: Math.ceil(totalUsers / limit),
    totalUsers,
    users,
  };
});
