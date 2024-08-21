import * as z from "zod";
export const LoginSchema = z.object({
  phone: z
    .string()
    .min(10, {
      message: "Please enter a valid phone number",
    })
    .max(11, {
      message: "Please enter a valid phone number",
    }),
});
