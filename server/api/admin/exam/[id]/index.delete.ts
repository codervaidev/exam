export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);
  const id = event.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Exam ID is required"
    });
  }

  // Get question IDs for this exam
  const questions = await query<{ id: string }>(`
    SELECT id FROM free_exam_questions WHERE exam_id = $1
  `, [id]);

  const questionIds = questions.data?.map(q => q.id) || [];

  // Delete related options first
  if (questionIds.length > 0) {
    await query(`
      DELETE FROM free_exam_question_options 
      WHERE question_id = ANY($1)
    `, [questionIds]);
  }

  // Delete related questions
  await query(`
    DELETE FROM free_exam_questions WHERE exam_id = $1
  `, [id]);

  // Delete related submissions
  await query(`
    DELETE FROM free_exam_submissions WHERE exam_id = $1
  `, [id]);

  // Delete the exam
  const result = await query(`
    DELETE FROM free_exam_exams WHERE id = $1 RETURNING id
  `, [id]);

  if (!result.success || !result.data?.length) {
    throw createError({
      statusCode: 404,
      statusMessage: "Exam not found"
    });
  }

  return {
    statusCode: 204,
    statusMessage: "Exam deleted successfully",
  };
});
