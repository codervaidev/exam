import { z } from "zod";

export const ExamSchema = z.object({
  id: z.string().optional(), // id is optional when creating a new exam, as it's generated automatically
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  level: z.string().min(1, "Level is required"),
  campaignId: z.string().min(1, "Campaign is required"),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid start time",
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid end time",
  }),
  duration: z.number().positive("Duration must be a positive number"),
  totalMarks: z.number().positive("Total marks must be a positive number"),
  shuffleQuestions: z.boolean().optional(),
  negativeMarking: z.boolean().optional(),
  
});

export const CampaignSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid start time",
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid end time",
  }),
  level: z.string().min(1, "Level is required"),
  status: z.enum(["pending", "active", "completed"]).optional(),
});
