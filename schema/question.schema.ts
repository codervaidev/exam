import * as z from "zod";
export const questionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  examId: z.string().min(1, "Exam is required"),
  options: z
    .array(
      z.object({
        option_text: z.string().min(1, "Option text is required"),
        correct: z.boolean(),
      })
    )
    .min(2, "At least two options are required"),
  subjectId: z.string().min(1, "Subject is required"),
  chapterId: z.string().min(1, "Chapter is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  explain: z.string().optional(),
});
