import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const is_fake_auth =
  process.env.NODE_ENV === "development" ||
  process.env.VERCEL_ENV === "preview";

export const auth_options = {
  providers: [
    is_fake_auth
      ? CredentialsProvider({
          name: "Credentials",
          credentials: {
            username: {
              label: "Username",
              type: "text",
              placeholder: "jsmith",
            },
            password: { label: "Password", type: "password" },
          },
          async authorize() {
            return {
              id: "1",
              name: "Joseph Smith",
              email: "jsmith@example.com",
              image: "https://i.pravatar.cc/150?u=jsmith@example.com",
            };
          },
        })
      : GoogleProvider({
          clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
          clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
        }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        // @ts-expect-error
        return profile.email_verified;
      }

      return true; // Do different verification for other providers that don't have `email_verified`
    },
  },
} satisfies NextAuthOptions;
