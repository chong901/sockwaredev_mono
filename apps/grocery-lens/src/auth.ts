import { edgedbClient } from "@/edgedb";
import e from "@/edgedb/edgeql-js";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const nextAuth = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    signIn: async ({ user }) => {
      const userExists = await e
        .select(e.User, () => ({
          filter_single: { email: user.email ?? "" },
        }))
        .run(edgedbClient);
      if (!userExists && user.email) {
        await e
          .insert(e.User, {
            email: user.email,
            image: user.image,
            name: user.name,
          })
          .run(edgedbClient);
      }
      return true;
    },
  },
});
