import * as z from "zod";

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot be more than 100 characters"),

  phone: z
    .string()
    .min(10, "Phone number must be valid")
    .max(15, "Phone number cannot be valid")
    .regex(/^01[0-9]{8,13}$/, "Phone number must be a valid format"),


  institute: z
    .string()
    .min(1, "Institute is required")
    .max(100, "Institute cannot be more than 100 characters"),

  level: z.string().max(50, "Level cannot be empty"),

});
