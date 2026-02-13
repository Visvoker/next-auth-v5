import prisma from "@/lib/prisma";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verification = await prisma.verificationToken.findUnique({
      where: { token },
    });

    return verification;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verification = await prisma.verificationToken.findFirst({
      where: { email },
    });

    return verification;
  } catch (error) {
    return null;
  }
};
