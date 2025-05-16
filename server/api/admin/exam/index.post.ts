import { zh } from "h3-zod";
import { ExamSchema } from "~/schema/exam.schema";
import { formatDate } from "~/server/utils/format";

export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);
  const { data, error } = await zh.useSafeValidatedBody(event, ExamSchema);

  if (error) {
    return {
      status: 400,
      statusMessage: error,
    };
  }

  await db.exam.create({
    data: {
      title: data.title,
      subject: data.subject,
      start_time: formatDate(data.startTime),
      end_time: formatDate(data.endTime),
      result_publish_time: formatDate(data.resultPublishTime),
      solution_publish_time: formatDate(data.solutionPublishTime),
      shuffle_questions: data.shuffleQuestions,
      negative_marking: data.negativeMarking,
      duration: data.duration,
      total_marks: data.totalMarks,
    },
  });

  return {
    statusCode: 201,
    statusMessage: "Exam created successfully",
  };
});
