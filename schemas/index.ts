import { UserRole } from "@/app/generated/prisma/enums";
import * as z from "zod";

export const SettingsSchema = z.object({
  name: z.string().optional(),
  isTwoFactorEnabled: z.boolean().optional(),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  email: z.string().email("Invalid email").optional(),
  password: z.string().min(6, "Minimum of 6 characters required").optional(),
  newPassword: z.string().min(6, "Minimum of 6 characters required").optional(),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, "Minimum of 6 characters required"),
});

export const ResetSchema = z.object({
  email: z.string().refine((val) => /\S+@\S+\.\S+/.test(val), {
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().refine((val) => /\S+@\S+\.\S+/.test(val), {
    message: "Email或密碼錯誤",
  }),
  password: z.string().min(1, "Email或密碼錯誤"),
  code: z.string().optional(),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, "必須填寫名稱"),
  email: z.string().refine((val) => /\S+@\S+\.\S+/.test(val), {
    message: "必須填寫Email",
  }),
  password: z.string().min(6, "密碼至少為6個"),
});
