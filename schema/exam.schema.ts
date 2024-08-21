import { z } from "zod";

export const ExamSchema = z.object({
  id: z.string().optional(), // id is optional when creating a new exam, as it's generated automatically
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid start time",
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid end time",
  }),
  duration: z.number().positive("Duration must be a positive number"),
  totalMarks: z.number().positive("Total marks must be a positive number"),
  resultPublishTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid result publish time",
  }),
  solutionPublishTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid solution publish time",
  }),
});
