"use server";

import { RegisterSchema } from "@/schemas";
import z from "zod";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedField = RegisterSchema.safeParse(values);

  if (!validatedField) {
    return { error: "Invalid fields" };
  }

  return { success: "Email sent!" };
};
