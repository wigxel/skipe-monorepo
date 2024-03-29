import { LoginButton } from "~/app/login-button";
import { HelpCircle } from "lucide-react";
import React from "react";
import { getServerSession } from "next-auth/next";
import { AuthSessionProvider } from "./auth-session-provider";
import { auth_options } from "~/config/next-auth";

export default async function Template(props: { children?: React.ReactNode }) {
  const session = await getServerSession(auth_options);

  return (
    <AuthSessionProvider session={session}>
      <main
        className={"bg-yellow-400 flex flex-col text-foreground min-h-screen"}
      >
        <header
          className={
            "flex justify-between container items-center px-4 sticky top-0 flex-shrink-0"
          }
        >
          <div
            className={
              "tracking-[2px] text-right bg-gradient from-[100%] to-white py-2 rounded-full text-black"
            }
          >
            <a
              href={"/"}
              className={
                "px-6 text-right py-2 border-black border rounded-full inline-flex justify-center"
              }
            >
              <span className={"font-black"}>SKIPE</span>
            </a>
          </div>

          <div className={"flex space-x-2"}>
            <LoginButton />
          </div>
        </header>

        {props.children}

        <button
          className={
            "aspect-square fixed right-2 bottom-2 h-[40px] inline-flex items-center justify-center rounded-full hover:bg-white/[0.3] w-[40px]"
          }
        >
          <HelpCircle />
        </button>
      </main>
    </AuthSessionProvider>
  );
}
