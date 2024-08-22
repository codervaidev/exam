import { zh } from "h3-zod";
import { ExamSchema } from "~/schema/exam.schema";

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
      ...data,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      resultPublishTime: new Date(data.resultPublishTime),
      solutionPublishTime: new Date(data.solutionPublishTime),
    },
  });

  return {
    statusCode: 201,
    statusMessage: "Exam created successfully",
  };
});
