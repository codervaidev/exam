
export default defineEventHandler(async (event) => {
    const user = event.context.user;
    if (!user) {
        throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        });
    }
    const level = user.level;
    
    const nextExamSql = `
    SELECT start_time FROM free_exam_exams
    WHERE level = $1 AND start_time >= NOW()
    ORDER BY start_time ASC
    LIMIT 1
    `;
    const nextExam = await query<{ start_time: string }>(nextExamSql, [level]);
    
    if(nextExam.data && nextExam.data.length > 0){

    return {
            nextExam: nextExam.data[0].start_time
        }
    }
    return {
        nextExam: null
    }

});