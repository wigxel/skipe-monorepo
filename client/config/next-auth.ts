import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const auth_options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    }),
  ],
} satisfies NextAuthOptions;
