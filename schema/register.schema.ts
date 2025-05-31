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

  district: z
    .string()
    .min(1, "District is required")
    .max(50, "District cannot be more than 50 characters"),

  thana: z
    .string()
    .min(1, "Thana is required")
    .max(50, "Thana cannot be more than 50 characters"),

  institute: z
    .string()
    .min(1, "Institute is required")
    .max(100, "Institute cannot be more than 100 characters"),

  tshirt: z.string().max(50, "T-shirt size cannot be empty"),

  batch: z.string().max(50, "Batch cannot be empty"),

  address: z.string().max(200, "Address cannot be more than 200 characters"),
});
