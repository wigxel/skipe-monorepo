import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { ofetch } from "ofetch";

export const is_fake_auth = !(
  process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview"
);

export const auth_options = {
  useSecureCookies: process.env.NODE_ENV !== "development",
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
    async jwt({ token, account }) {
      if (account?.provider === "google") {
        const user_details = await ofetch(
          "http://localhost:3000/api/oauth/google",
          {
            method: "post",
            body: { token: account.id_token },
          },
        ).catch((err) => {
          throw new Error("User doesn't exist in our database");
        });

        if (user_details) {
          token.app_user = user_details;
        }
      }

      return token;
    },
    session({ session, token }) {
      return { ...session, app_user: token.app_user };
    },
  },
} satisfies NextAuthOptions;
