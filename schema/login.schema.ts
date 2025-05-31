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

export const UpdateSchema = z.object({
  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address cannot be more than 200 characters"),

  tshirt: z.string().max(50, "T-shirt size cannot be empty"),
});
