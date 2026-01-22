"use server";

import { LoginSchema } from "@/schemas";
import z from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedField = LoginSchema.safeParse(values);

  if (!validatedField) {
    return { error: "Invalid fields" };
  }

  return { success: "Email sent!" };
};
