"use client";
import React from "react";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { SendIcon, ShieldCheck } from "lucide-react";
import { Scrollbar } from "~/app/vendor/scroll-bar";
import { Button } from "~/components/ui/button";
import { useTyping } from "~/hooks/use-typing";
import { ChatProvider, useChat } from "~/contexts/chat-context";
import { app } from "~/lib/firebase.config";
import { ChatMessageBox } from "~/components/chat/message-box";
import { MessageBubble } from "~/components/chat/message-bubble";
import { MessagesBox } from "~/components/chat/message-scroll-container";
import { createMessage } from "~/core/message";
import { useMessageSubscription } from "~/hooks/use-message-subscription";

const MOCKS = {
  SENDER_ID: "some-random-id",
  RECEIVED_ID: "some-other-id",
  CHANNEL_ID: "ADTje3HqNuGrkj68imYr",
};

export default function ChatRoot() {
  return (
    <ChatProvider app={app}>
      <ChatPage />
    </ChatProvider>
  );
}

function ChatPage() {
  const channel_id = MOCKS.CHANNEL_ID;
  const { loadChannels } = useChat();

  const [messages, setMessages] = React.useState([]);
  const [contacts, setContacts] = React.useState([]);

  useMessageSubscription(channel_id, (event) => {
    setMessages((arr) => [...arr, ...event]);
  });

  React.useEffect(() => {
    loadChannels().then((contacts) => setContacts(contacts));
    //console.info("Contacts", contacts));
  }, []);

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
                <li
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
                    <p>Phillip</p>

                    <p
                      className={
                        "text-muted-foreground text-xs overflow-ellipsis overflow-hidden"
                      }
                    >
                      Lorem ipsum dolor sit elit....
                    </p>
                  </div>
                </li>
                {contacts.map((name, index) => {
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
                        <p>{(name.channel_type === 'group') ? name.group_name : '--'}</p>

                        <p
                          className={
                            "text-muted-foreground text-xs overflow-ellipsis overflow-hidden"
                          }
                        >
                          { name.last_message }
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
                        <span
                          key={"symbol"}
                          className={"text-muted-foreground"}
                        >
                          @
                        </span>
                      ) : (
                        <span key="name" className={"font-medium"}>
                          {e}
                        </span>
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
            <MessagesBox
              getScrollContainer={(target) => {
                return target.parentElement;
              }}
            >
              <div className={"border-y flex-1 border-gray-50 px-4"}>
                {messages.map((message) => {
                  if (message?.type !== "Message") return null;

                  return (
                    <MessageBubble
                      key={message.id}
                      position={
                        message.recipient === MOCKS.SENDER_ID ? "right" : "left"
                      }
                      {...message}
                    />
                  );
                })}
              </div>
            </MessagesBox>
          </Scrollbar>

          <ComposeMessage />
        </section>
      </Card>
    </div>
  );
}

function ComposeMessage() {
  const { sendMessage } = useChat();

  const [text, setText] = React.useState("");
  const { typing, startTyping } = useTyping(
    MOCKS.CHANNEL_ID,
    MOCKS.RECEIVED_ID,
    //     {
    //   formatter: (person: { typing: boolean; id: string }[]) => {
    //     return person.map((e) => e.id).join(" ") + " are typing";
    //   },
    // }
  );

  return (
    <div
      className={
        "min-h-[60px] flex flex-col w-full px-[var(--space-x)] py-[calc(var(--space-x))]"
      }
    >
      <div className={"flex space-x-1"}>
        <ChatMessageBox
          placeholder={"Message Vendor"}
          className={"w-full bg-gray-50 rounded-lg border"}
          value={text}
          onKeyUp={() => startTyping()}
          onChange={(evt) => {
            setText(evt.currentTarget.value);
          }}
        />

        <Button
          title={"Send message"}
          onClick={async () => {
            try {
              await sendMessage({
                channel_id: MOCKS.CHANNEL_ID,
                message: createMessage({
                  message: text,
                  recipient: MOCKS.SENDER_ID,
                }),
                receiverId: "some-other-id",
                senderId: MOCKS.RECEIVED_ID,
              });
              setText("");
            } catch {
              // TODO: Display failure state
            }
          }}
        >
          <SendIcon />
        </Button>
      </div>

      {typing ? (
        <p className={"italic text-xs text-muted-foreground"}>
          someone is typing
        </p>
      ) : (
        <p className={"italic text-xs text-muted-foreground"}>
          Press <span className={"font-semibold not-italic"}>Enter</span> to
          send
        </p>
      )}
    </div>
  );
}
