import { db } from "@/db/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const nextAuth = NextAuth({
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
  session: {
    maxAge: 24 * 7 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    jwt: async ({ token }) => {
      if (!token.userId) {
        const user = await db.selectFrom("user").selectAll().where("email", "=", token.email!).executeTakeFirst();
        token.userId = user?.id ?? "";
      }
      return token;
    },
    session: async (param) => {
      const { session, token } = param;
      session.userId = (token.userId as string) ?? "";
      return session;
    },
    signIn: async ({ user }) => {
      if (!user.email) {
        return false;
      }
      const dbUser = await db.selectFrom("user").where("email", "=", user.email).selectAll().executeTakeFirst();
      if (!dbUser) {
        await db.insertInto("user").values({ email: user.email, name: user.name, image: user.image }).returningAll().executeTakeFirst();
      }

      return true;
    },
  },
});
