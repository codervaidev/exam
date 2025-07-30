import { getNextAvailableExam } from "~/server/utils/exam";

export default defineEventHandler(async (event) => {
 

  // total student count
  const totalUsers = await query<{total_students: string}>(`SELECT count(1) as total_students from free_exam_users`)



  return {
    statusCode: 200,
    body: {
      totalUsers: totalUsers.data?.[0]?.total_students
    }
  };
});