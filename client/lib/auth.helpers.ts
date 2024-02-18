import { signIn as signIn_ } from "next-auth/react";
import { is_fake_auth } from "~/config/next-auth";

export { signOut } from "next-auth/react";

export const signIn = () => {
  signIn_(is_fake_auth ? "credentials" : "google");
};
