import { db } from "@/db/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const nextAuth = NextAuth({
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
    session: async ({ session }) => {
      const dbUser = await db
        .selectFrom("user")
        .selectAll()
        .where("email", "=", session.user.email)
        .execute();
      session.userId = dbUser[0]?.id ?? "";
      return session;
    },
    signIn: async ({ user }) => {
      if (!user.email) {
        return false;
      }
      const dbUser = await db
        .selectFrom("user")
        .where("email", "=", user.email)
        .selectAll()
        .execute();
      if (dbUser.length === 0) {
        await db
          .insertInto("user")
          .values({ email: user.email, name: user.name, image: user.image })
          .execute();
      }
      return true;
    },
  },
});
