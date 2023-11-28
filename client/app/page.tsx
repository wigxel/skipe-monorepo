import React from "react";
import Balancer from "react-wrap-balancer";
import { Button } from "~/components/ui/button";
import { HelpCircle } from "lucide-react";
import { RequestForm } from "~/app/request-form";
import { LoginButton } from "~/app/login-button";

export default function Home() {
  return (
    <main className={"bg-yellow-400 min-h-screen"}>
      <div className={"flex justify-between items-center px-4 sticky top-0"}>
        <div
          className={
            "tracking-[2px] text-right bg-gradient from-[100%] to-white py-2 rounded-full text-black"
          }
        >
          <div
            className={
              "px-6 text-right py-2 border-black border rounded-full inline-flex justify-center"
            }
          >
            <span className={"font-black"}>SKIPE</span>
          </div>
        </div>

        <div className={"flex space-x-2"}>
          <LoginButton />
          <button
            className={
              "aspect-square h-[40px] inline-flex items-center justify-center rounded-full hover:bg-white/[0.3] w-[40px]"
            }
          >
            <HelpCircle />
          </button>
        </div>
      </div>

      <section
        className={
          "flex items-center gap-x-24 justify-center min-h-screen container py-0"
        }
      >
        <h1
          className={
            "flex flex-col items-end text-right font-light text-7xl  tracking-[-2px]"
          }
        >
          <span>
            <span>You </span>
            <span>share.</span>
          </span>
          <span className={"left-4/12"}>
            <span>
              We <b className={"font-black"}>find</b>.
            </span>
          </span>
          <span className={"text-lg mt-0 tracking-normal"}>
            <Balancer>That&apos;s it.</Balancer>
          </span>
        </h1>

        <form
          action={async function upload(data) {
            "use server";
            console.log(data);
          }}
        >
          <RequestForm />
        </form>
      </section>
    </main>
  );
}
