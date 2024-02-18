import NextAuth from "next-auth";
import { auth_options } from "~/config/next-auth";

const handler = NextAuth(auth_options);

export { handler as GET, handler as POST };
