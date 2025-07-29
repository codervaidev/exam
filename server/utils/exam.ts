import { query } from './db';

export interface ExamAccessCheck {
  canAccess: boolean;
  reason?: string;
  requiredExams?: string[];
}

/**
 * Check if a user can access an exam based on sequential logic
 */
export async function checkExamAccess(
  userId: string, 
  examId: string
): Promise<ExamAccessCheck> {
  // Get exam details
  const examResult = await query<{
    id: string;
    sequence_order: number;
  }>(`
    SELECT id, sequence_order 
    FROM free_exam_exams 
    WHERE id = $1
  `, [examId]);

  const exam = examResult.data?.[0];
  
  if (!exam) {
    return {
      canAccess: false,
      reason: 'Exam not found'
    };
  }

  // If it's the first exam in a campaign, allow access
  if (exam.sequence_order <= 1) {
    return { canAccess: true };
  }

  // Get all previous exams in the same campaign
  const previousExamsResult = await query<{ id: string; title: string }>(`
    SELECT id, title 
    FROM free_exam_exams 
    WHERE sequence_order < $1
    ORDER BY sequence_order ASC
  `, [exam.sequence_order]);

  const previousExams = previousExamsResult.data || [];
  
  if (previousExams.length === 0) {
    return { canAccess: true };
  }

  // Check if user has completed all previous exams
  const completedExamsResult = await query<{ exam_id: string }>(`
    SELECT exam_id 
    FROM free_exam_submissions 
    WHERE user_id = $1 AND exam_id = ANY($2) AND status = 'submitted'
  `, [userId, previousExams.map(e => e.id)]);

  const completedExams = completedExamsResult.data?.map(row => row.exam_id) || [];
  const allPreviousCompleted = previousExams.every(prevExam => 
    completedExams.includes(prevExam.id)
  );

  if (!allPreviousCompleted) {
    const missingExams = previousExams.filter(prevExam => 
      !completedExams.includes(prevExam.id)
    );
    
    return {
      canAccess: false,
      reason: `You must complete Exam ${exam.sequence_order - 1} first before accessing this exam`,
      requiredExams: missingExams.map(e => e.id)
    };
  }

  return { canAccess: true };
}

/**
 * Get the next available exam for a user in a campaign
 */
export async function getNextAvailableExam(
  userId: string, 
  campaignId: string
): Promise<string | null> {
  // Get all exams in the campaign ordered by sequence
  const examsResult = await query<{
    id: string;
    sequence_order: number;
  }>(`
    SELECT id, sequence_order 
    FROM free_exam_exams 
    ORDER BY sequence_order ASC
  `, [campaignId]);

  const exams = examsResult.data || [];
  
  if (exams.length === 0) {
    return null;
  }

  // Get user's completed exams in this campaign
  const completedExamsResult = await query<{ exam_id: string }>(`
    SELECT s.exam_id
    FROM free_exam_submissions s
    JOIN free_exam_exams e ON s.exam_id = e.id
    WHERE s.user_id = $1 
      AND e.campaign_id = $2 
      AND s.status = 'submitted'
  `, [userId, campaignId]);

  const completedExams = completedExamsResult.data?.map(row => row.exam_id) || [];

  // Find the first exam that hasn't been completed
  for (const exam of exams) {
    if (!completedExams.includes(exam.id)) {
      return exam.id;
    }
  }

  // All exams completed
  return null;
} 