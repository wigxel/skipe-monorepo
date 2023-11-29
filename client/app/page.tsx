import React from "react";
import Balancer from "react-wrap-balancer";
import { RequestForm } from "~/app/request-form";


export default function Home() {
  return (
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

  );
}
