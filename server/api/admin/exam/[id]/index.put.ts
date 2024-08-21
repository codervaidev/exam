import { zh } from "h3-zod";
import { ExamSchema } from "~/schema/exam.schema";
export default defineEventHandler(async (event) => {
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
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      resultPublishTime: new Date(data.resultPublishTime),
      solutionPublishTime: new Date(data.solutionPublishTime),
    },
  });

  return {
    status: 201,
    message: 'Exam updated successfully',
  };
});
