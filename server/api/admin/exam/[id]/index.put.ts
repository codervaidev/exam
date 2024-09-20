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

  const exam = await db.exam.update({
    where: {
      id: examId,
    },
    data: {
      ...data,
      startTime: formatDate(data.startTime),
      endTime: formatDate(data.endTime),
      resultPublishTime: formatDate(data.resultPublishTime),
      solutionPublishTime: new Date(data.solutionPublishTime),
    },
  });

  return {
    status: 201,
    message: "Exam updated successfully",
  };
});
