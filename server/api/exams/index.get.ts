export default defineEventHandler(async (event) => {


  const userLevel = event.context.user?.level;

  if (!userLevel) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }


  const campaign = getQuery(event).campaign;
  const campaignId = campaign ? campaign : null;
  console.log(campaignId);
  

  const exams = await query<{
    id: string;
    title: string;
    subject: string;
    level: string;
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
    ${campaignId ? `WHERE e.campaign_id = $2` : ''}
    ORDER BY e.start_time ASC
  `, [event.context.user?.id, campaignId]);

  const currentDate = new Date();

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

    return {
      ...exam,
      status,
      submission: exam.submission_id ? {
        id: exam.submission_id,
        status: exam.submission_status,
        marks: exam.submission_marks,
        duration: exam.submission_duration,
        submitted_at: exam.submission_submitted_at,
      } : null,
    };
  });

  const ongoingExams = examsWithStatus.filter((e) => e.status === "ongoing");
  const upcomingExams = examsWithStatus.filter((e) => e.status === "upcoming");
  const pastExams = examsWithStatus
    .filter((e) => e.status === "past")
    .reverse();

  return {
    statusCode: 200,
    body: {
      ongoingExams,
      upcomingExams: upcomingExams,
      pastExams: pastExams,
    },
  };
});
