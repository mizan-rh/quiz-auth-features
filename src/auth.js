import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { getUserById } from "./data/user";
import { getAccountByUserId } from "./data/account";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      if (!user.id) return false;

      const existingUser = await getUserById(user.id);
      if (!existingUser?.emailVerified) return false;

      return true;
    },
    async jwt({ token, user }) {
      // Add role to token when user logs in
      if (user) {
        const existingUser = await getUserById(user.id);
        token.role = existingUser?.role || null; // <-- add role
        token.name = existingUser?.name;
        token.email = existingUser?.email;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role; // <-- add role to session
      }
      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  ...authConfig,
});
