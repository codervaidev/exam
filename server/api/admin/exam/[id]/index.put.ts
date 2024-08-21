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

  const exam = await db.author.update({
    where: {
      id: examId,
    },
    data: {
      ...data,
    },
  });

  return {
    status: 201,
    body: exam,
  };
});
