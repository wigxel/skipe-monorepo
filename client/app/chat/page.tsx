"use client";
import React, { ComponentProps } from "react";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { ShieldCheck } from "lucide-react";
import { Scrollbar } from "~/app/vendor/scroll-bar";

export default function ChatPage() {
  return (
    <div
      className={
        "py-4 px-4 container flex flex-col flex-1 items-start justify-center"
      }
    >
      <Card
        className={
          "border bg-gray-100 rounded-2xl mx-auto w-full p-0 flex flex-1 max-h-screen items-stretch"
        }
      >
        <div className={"w-3/12 flex flex-col max-h-[100%] max-w-[350px] px-4"}>
          <CardHeader className={"flex-shrink-0 pl-2"}>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>

          <div className={"border-t"} />

          <div className={"flex-1 -mr-4 -ml-2"}>
            <Scrollbar>
              <aside className={"overflow-hidden py-2 pr-4"}>
                {Array(100)
                  .fill("James Walker")
                  .map((name) => {
                    return (
                      <li
                        key={name}
                        className={
                          "hover:bg-white cursor-default rounded-xl p-4 flex space-x-2 items-center h-[80px]"
                        }
                      >
                        <figure
                          className={
                            "w-12 aspect-square bg-gray-200 rounded-full shrink-0"
                          }
                        />
                        <div className={"flex-1 "}>
                          <p>{name}</p>

                          <p
                            className={
                              "text-muted-foreground text-xs overflow-ellipsis overflow-hidden"
                            }
                          >
                            Lorem ipsum dolor sit elit....
                          </p>
                        </div>
                      </li>
                    );
                  })}
              </aside>
            </Scrollbar>
          </div>
          <div className={"py-2 shrink-0"} />
        </div>

        <section
          className={
            "flex-1 flex z-20 relative flex-col bg-white shadow rounded-xl mt-2 mr-2 mb-2 [--space-x:1rem] [--space-y:0.5rem]"
          }
        >
          <div
            className={
              "p-[--space-x] py-[--space-y] flex justify-between items-center"
            }
          >
            <div className={"space-x-2 flex"}>
              <figure className={"w-12 h-12 rounded-lg bg-gray-200"}></figure>

              <div className={"flex flex-col flex-1 space-y-1"}>
                <p className={"text-base items-center space-x-2 flex"}>
                  <span className={"inline-flex"}>
                    {"@johseph.wlaker".split("@").map((e) => {
                      return e === "" ? (
                        <span className={"text-muted-foreground"}>@</span>
                      ) : (
                        <span className={"font-medium"}>{e}</span>
                      );
                    })}
                  </span>

                  {true ? (
                    <ShieldCheck color={"limegreen"} size={"1em"}>
                      Verified
                    </ShieldCheck>
                  ) : null}
                </p>

                <p className={"text-xs text-muted-foreground"}>
                  Joined 13 days ago
                </p>
              </div>
            </div>
            <span
              className={"italic text-sm bg-gray-50 px-2 py-1 rounded-full "}
            >
              For you safe do not share <b>contact</b> information
            </span>
          </div>
          <div className={"border-y flex-1 border-gray-50"} />
          <div
            className={
              "min-h-[60px] w-full px-[var(--space-x)] py-[calc(var(--space-x))]"
            }
          >
            <ChatMessageBox
              placeholder={"Message Vendor"}
              className={"w-full bg-gray-50 rounded-lg border"}
            />
          </div>
        </section>
      </Card>
    </div>
  );
}

const ChatMessageBox = React.forwardRef<
  HTMLTextAreaElement,
  ComponentProps<"textarea">
>(function ChatMessageBox(props, ref) {
  const { children, className, ...PROPS } = props;
  const [rows, setRows] = React.useState<number>(1);

  return (
    <>
      <textarea
        name="msg"
        {...PROPS}
        style={{ height: Math.min(rows * 24, 240) }}
        onChange={(event) => {
          const new_lines = /\n/gm;

          if (!new_lines.test(event.target.value)) {
            return setRows(0);
          }

          setRows(
            ((event.target.value ?? "").match(new_lines)?.length || 1) + 1,
          );
        }}
        className={cn(
          "max-h-[240px] min-h-[40px] px-2 leading-[1.6] flex-1 resize-none text-[1rem] focus:outline-none",
          props.className,
        )}
      />
      <p className={"italic text-xs text-muted-foreground"}>
        Press{" "}
        <span className={"font-semibold not-italic text-foreground"}>
          Enter
        </span>{" "}
        to send
      </p>
    </>
  );
});
