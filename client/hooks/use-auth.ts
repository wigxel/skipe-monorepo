import { useSession } from "next-auth/react";

export function AuthUser(
  data: Partial<{ name: string; email: string; image: string }>,
) {
  return {
    name: data?.name ?? "Anonymous",
    email: data?.email ?? "--",
    image: data?.image ?? undefined,
    get first_name() {
      return this.name.split(" ")[0] ?? "--";
    },
    get initials() {
      return data.name
        .split(" ")
        .map((e) => e[0])
        .join("");
    },
  };
}

export function useAuth() {
  const session = useSession();

  return {
    user: AuthUser(session?.data?.user),
    is_logged_in: session.status === "unauthenticated",
  };
}
