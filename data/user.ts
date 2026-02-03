import prisma from "@/lib/prisma";

export async function getUserByEmail(email: string) {
  try {
    const user = prisma.user.findUnique({
      where: { email },
    });

    return user;
  } catch {
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    const user = prisma.user.findUnique({
      where: { id },
    });

    return user;
  } catch {
    return null;
  }
}
