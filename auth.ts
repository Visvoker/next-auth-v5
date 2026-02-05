import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import prisma from "@/lib/prisma";
import { LoginSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";

const providers: Provider[] = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  }),
  Discord({
    clientId: process.env.AUTH_DISCORD_ID,
    clientSecret: process.env.AUTH_DISCORD_SECRET,
  }),
  Credentials({
    authorize: async (credentials) => {
      const validatedFields = LoginSchema.safeParse(credentials);

      if (validatedFields.success) {
        const { email, password } = validatedFields.data;

        const user = await getUserByEmail(email);
        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) return user;
      }

      return null;
    },
  }),
];

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers,
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async session({ token, session }) {
      console.log({ sessionToke: token });

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;

      return token;
    },
  },
});
