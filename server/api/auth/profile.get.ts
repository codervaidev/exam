export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id;

  const submissions = await query<{
    exam_title: string;
    exam_duration: number;
    marks: number;
    duration: number;
    correct: number;
    incorrect: number;
    skipped: number;
  }>(`
    SELECT 
      e.title as exam_title,
      e.duration as exam_duration,
      s.marks,
      s.duration,
      s.correct,
      s.incorrect,
      s.skipped
    FROM free_exam_submissions s
    JOIN free_exam_exams e ON s.exam_id = e.id
    WHERE s.user_id = $1 AND s.status = 'submitted'
  `, [userId]);

  return submissions.data || [];
});
