"use client";
import React, { ComponentProps } from "react";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { SendIcon, ShieldCheck } from "lucide-react";
import { Scrollbar } from "~/app/vendor/scroll-bar";
import { Button } from "~/components/ui/button";
import messages from "./data.json";
import { initialize, useSubscription } from "~/core/chat";
import { createMessage } from "~/core/message";
import { app } from "~/lib/firebase.config";
import { filter, Observable } from "rxjs";
import { ValueOf } from "next/constants";
import { observableToBeFn } from "rxjs/internal/testing/TestScheduler";
import { unknown } from "zod";

export default function ChatPage() {
  const channel_id = "ADTje3HqNuGrkj68imYr";
  const user_id = "some-random-id";

  React.useEffect(() => {
    // const unsubscribe = onNewMessage({
    //   channel_id: "ADTje3HqNuGrkj68imYr",
    // });
    //
    // // return unsubscribe;
    //
    // const unsubscribe_typing = onTyping({
    //   channel_id: "ADTje3HqNuGrkj68imYr",
    //   user_id: "some-random-id",
    // });
    //
    // sendMessage({
    //   senderId: "",
    //   receiverId: "",
    //   channel_id: "ADTje3HqNuGrkj68imYr",
    //   message: createMessage({ message: "Hi", recipient: "someone-random-id" }),
    // })
    //   .then(console.info)
    //   .catch(console.error);
    //
    // loadMessages("ADTje3HqNuGrkj68imYr", { limit: 50 }).then((channels) => {
    //   console.log({ channels });
    // });
    //
    // return () => {
    //   unsubscribe_typing();
    //   unsubscribe();
    // };
  }, []);

  const { typing } = useTyping(
    channel_id,
    user_id,
    //     {
    //   formatter: (person: { typing: boolean; id: string }[]) => {
    //     return person.map((e) => e.id).join(" ") + " are typing";
    //   },
    // }
  );

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
                  .map((name, index) => {
                    return (
                      <li
                        key={index}
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
              For your safety do not share <b>contact</b> information
            </span>
          </div>

          <Scrollbar>
            <div className={"border-y flex-1 border-gray-50 px-4"}>
              {messages.conversation.map(MessageBubble)}
            </div>
          </Scrollbar>
          <div
            className={
              "min-h-[60px] w-full px-[var(--space-x)] py-[calc(var(--space-x))]"
            }
          >
            <div className={"flex space-x-1"}>
              <ChatMessageBox
                placeholder={"Message Vendor"}
                className={"w-full bg-gray-50 rounded-lg border"}
              />

              <Button title={"Send message"}>
                <SendIcon />
              </Button>
            </div>

            {typing ? (
              <p className={"italic absolute text-xs text-muted-foreground"}>
                someone is typing
              </p>
            ) : (
              <p className={"italic absolute text-xs text-muted-foreground"}>
                Press <span className={"font-semibold not-italic"}>Enter</span>{" "}
                to send
              </p>
            )}
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
        ref={ref}
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
    </>
  );
});

function MessageBubble(e: (typeof messages.conversation)[0]) {
  const isLeft = e.sender === "Bob";
  const isOwner = isLeft;

  return (
    <li
      key={e.timestamp + e.sender}
      className={cn("flex items-end pe-4 gap-x-1 py-2")}
      style={{
        direction: isLeft ? "rtl" : "ltr",
      }}
    >
      <span
        className={cn("w-4 h-4 rounded-full pe-4 bg-blue-500", {
          "bg-orange-500": isLeft,
        })}
      />
      <div
        className={cn("p-2  max-w-[50%] text-sm rounded-2xl text-start", {
          "rounded-br-md bg-gray-100 text-gray/50": isLeft,
          "rounded-bl-md bg-purple-50 text-gray-800": !isLeft,
        })}
        style={{ direction: "ltr" }}
      >
        {isOwner ? null : (
          <span className={"opacity-50 text-xs"}>{e.sender}</span>
        )}
        <p>{e.message}</p>
      </div>
    </li>
  );
}

function useTyping(channel_id: string, user_id: string) {
  const { sendMessage, onNewMessage, onTyping } = React.useMemo(
    () => initialize(app),
    [],
  );

  const [typing, setTyping] = React.useState(false);
  const observable = React.useMemo(() => {
    return onTyping({
      channel_id,
      user_id,
    }).pipe(filter((e) => Object.hasOwn(e.data, "typing")));
  }, []);

  useSubscription(
    observable,
    React.useCallback((evt: ObservableEvent<typeof observable>) => {
      setTyping(evt.data.typing);
    }, []),
  );

  return { typing };
}

type ObservableEvent<T extends Observable<unknown>> = T extends Observable<
  infer TB
>
  ? TB
  : unknown;
