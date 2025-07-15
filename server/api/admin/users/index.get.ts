export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);
  const queryParams = getQuery(event);
  const page = parseInt(queryParams.page as string) || 1;
  const limit = parseInt(queryParams.limit as string) || 10;
  const skip = (page - 1) * limit;
  const search = queryParams.search as string || "";

  const usersResult = await query<{
    id: string;
    name: string;
    phone: string;
    district: string;
    thana: string;
    institute: string;
    role: string;
    level: string;
    created_at: string;
    updated_at: string;
  }>(`
    SELECT u.* 
    FROM free_exam_users u
    WHERE u.name ILIKE $1
    ORDER BY u.created_at DESC
    LIMIT $2 OFFSET $3
  `, [`%${search}%`, limit, skip]);

  const sessionsResult = await query<{
    user_id: string;
    id: string;
    expires_at: string;
  }>(`
    SELECT user_id, id, expires_at 
    FROM free_exam_sessions 
    WHERE user_id = ANY($1)
  `, [usersResult.data?.map(u => u.id) || []]);

  const users = (usersResult.data || []).map(user => ({
    ...user,
    sessions: sessionsResult.data?.filter(s => s.user_id === user.id) || []
  }));

  const totalUsersResult = await query<{count: number}>(
    `SELECT COUNT(*) as count FROM free_exam_users WHERE name ILIKE $1`,
    [`%${search}%`]
  );

  const totalUsers = totalUsersResult.data?.[0]?.count || 0;

  return {
    page,
    limit,
    totalPages: Math.ceil(totalUsers / limit),
    totalUsers,
    users,
  };
});
