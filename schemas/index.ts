import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().refine((val) => /\S+@\S+\.\S+/.test(val), {
    message: "Email或密碼錯誤",
  }),
  password: z.string().min(1, "Email或密碼錯誤"),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, "必須填寫名稱"),
  email: z.string().refine((val) => /\S+@\S+\.\S+/.test(val), {
    message: "必須填寫Email",
  }),
  password: z.string().min(6, "密碼至少為6個"),
});
