export default defineEventHandler(async (event) => {
  const userLevel = event.context.user?.level;
  const userId = event.context.user?.id;

  if (!userLevel) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  
  const exams = await query<{
    id: string;
    title: string;
    subject: string;
    level: string;
    sequence_order: number;
    start_time: string;
    end_time: string;
    duration: number;
    total_marks: number;
    result_publish_time: string;
    solution_publish_time: string;
    shuffle_questions: boolean;
    negative_marking: boolean;
    data: any;
    submission_id?: string;
    submission_status?: string;
    submission_marks?: number;
    submission_duration?: number;
    submission_submitted_at?: string;
  }>(`
    SELECT 
      e.*,
      s.id as submission_id,
      s.status as submission_status,
      s.marks as submission_marks,
      s.duration as submission_duration,
      s.submitted_at as submission_submitted_at
    FROM free_exam_exams e
    LEFT JOIN free_exam_submissions s ON e.id = s.exam_id AND s.user_id = $1
    ORDER BY e.sequence_order ASC, e.start_time ASC
  `, [userId]);

  const currentDate = new Date();

  // Get user's completed exams for this campaign to determine unlock status
  let completedExams: string[] = [];
 
    const completedResult = await query<{ exam_id: string }>(`
      SELECT s.exam_id
      FROM free_exam_submissions s
      JOIN free_exam_exams e ON s.exam_id = e.id
      WHERE s.user_id = $1
        AND s.status = 'submitted'
    `, [userId]);
    
    completedExams = completedResult.data?.map(row => row.exam_id) || [];
  

  const examsWithStatus = (exams.data || []).map((exam) => {
    let status = "";

    if (currentDate < new Date(exam.start_time)) {
      status = "upcoming";
    } else if (
      currentDate >= new Date(exam.start_time) &&
      currentDate <= new Date(exam.end_time)
    ) {
      status = "ongoing";
    } else if (currentDate > new Date(exam.start_time)) {
      status = "past";
    }

    // Check if exam is locked based on sequential logic
    let isLocked = false;
    let lockReason = "";
    
    if (exam.sequence_order > 1) {
      // Check if all previous exams are completed
      const previousExams = (exams.data || []).filter(e => 
       
        e.sequence_order < exam.sequence_order
      );
      
      const allPreviousCompleted = previousExams.every(prevExam => 
        completedExams.includes(prevExam.id)
      );
      
      if (!allPreviousCompleted) {
        isLocked = true;
        lockReason = `Complete Exam ${exam.sequence_order - 1} first`;
      }
    }


    // check if exam starts
    if(new Date(exam.start_time) > currentDate){
      isLocked = true;
      lockReason = "Exam not started yet";
    }

    return {
      ...exam,
      status,
      isLocked,
      lockReason,
      submission: exam.submission_id ? {
        id: exam.submission_id,
        status: exam.submission_status,
        marks: exam.submission_marks,
        duration: exam.submission_duration,
        submitted_at: exam.submission_submitted_at,
      } : null,
    };
  });

 

  return {
    statusCode: 200,
    body: examsWithStatus,
  };
});
