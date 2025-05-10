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

  const examId = event.context.params?.id;

  console.log(data);

  const exam = await db.exam.update({
    where: {
      id: examId,
    },
    data: {
      title: data.title,
      subject: data.subject,
      start_time: formatDate(data.startTime),
      end_time: formatDate(data.endTime),
      result_publish_time: formatDate(data.resultPublishTime),
      solution_publish_time: new Date(data.solutionPublishTime),
      duration: data.duration,
      total_marks: data.totalMarks,
    },
  });

  return {
    status: 201,
    message: "Exam updated successfully",
  };
});
