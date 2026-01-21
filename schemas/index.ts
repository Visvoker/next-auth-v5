import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().refine((val) => /\S+@\S+\.\S+/.test(val), {
    message: "Email 格式不正確",
  }),
  password: z.string().min(6, "密碼至少 6 碼"),
});
