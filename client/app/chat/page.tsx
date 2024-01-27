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
import { Channel } from "~/core/channel";
import { cn } from "~/lib/utils";

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

const safeArray = <T extends Array<unknown>>(a: T) => {
  return Array.isArray(a) ? a : [];
};

function ChatPage() {
  const { channel_id, channel } = useChat();
  const [channelMessageMap, setChannelMessageMap] = React.useState({
    [channel_id ?? "default"]: [],
  });

  useMessageSubscription(channel_id, (event) => {
    setChannelMessageMap((store) => ({
      ...store,
      [channel_id]: [...safeArray(store[channel_id]), ...event],
    }));
  });

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
        <Conversations />
        {channel.channel_type === "none" ? (
          <section
            className={
              "flex-1 flex z-20 relative flex-col bg-white shadow rounded-xl mt-2 mr-2 mb-2 [--space-x:1rem] [--space-y:0.5rem]"
            }
          >
            <p>No Contact</p>
          </section>
        ) : (
          <section
            className={
              "flex-1 flex z-20 relative flex-col bg-white shadow rounded-xl mt-2 mr-2 mb-2 [--space-x:1rem] [--space-y:0.5rem]"
            }
          >
            <MessageBoxHeader />

            <div className={"relative flex-1"}>
              {Object.entries(channelMessageMap).map(
                ([local_channel_id, messages], index) => {
                  const is_active = channel_id === local_channel_id;

                  return (
                    // <Scrollbar key={local_channel_id}>
                      <MessagesBox key={local_channel_id}
                        getScrollContainer={(target) => {
                          return target.parentElement;
                        }}
                      >
                        <div
                          className={
                            "overflow-y-scroll border-y bg-orange-200 absolute inset-0 flex-1 border-gray-50 px-4"
                          }
                          style={
                            !is_active
                              ? {}
                              : {
                                  visibility: "hidden",
                                }
                          }
                        >
                          {messages.map((message) => {
                            if (message?.type !== "Message") return null;

                            return (
                              <MessageBubble
                                key={message.id}
                                position={
                                  message.recipient === MOCKS.SENDER_ID
                                    ? "right"
                                    : "left"
                                }
                                {...message}
                              />
                            );
                          })}
                        </div>
                      </MessagesBox>
                    // </Scrollbar>
                  );
                },
              )}
            </div>

            <ComposeMessage channelId={channel_id} />
          </section>
        )}
      </Card>
    </div>
  );
}

function Conversations() {
  const { loadChannels, channel_id, switchChannel } = useChat();
  const [contacts, setContacts] = React.useState([]);

  const changeChannel = (channel: Channel) => {
    switchChannel(channel);
  };

  React.useEffect(() => {
    loadChannels().then((contacts) => setContacts(contacts));
  }, []);

  return (
    <div className={"w-3/12 flex flex-col max-h-[100%] max-w-[350px] px-4"}>
      <CardHeader className={"flex-shrink-0 pl-2"}>
        <CardTitle>Conversations</CardTitle>
      </CardHeader>

      <div className={"border-t"} />

      <div className={"flex-1 -mr-4 -ml-2"}>
        <Scrollbar>
          <aside className={"overflow-hidden py-2 pr-4"}>
            {contacts.map((channel) => {
              return (
                <Contact
                  key={channel.id}
                  data={channel}
                  isActive={channel_id === channel.id}
                  onClick={() => {
                    changeChannel(channel);
                  }}
                />
              );
            })}
          </aside>
        </Scrollbar>
      </div>
      <div className={"py-2 shrink-0"} />
    </div>
  );
}

function Contact(
  props: React.ComponentProps<"li"> & {
    data: Exclude<Channel, { channel_type: "none" }>;
    isActive?: boolean;
    children?: React.ReactNode;
  },
) {
  const { data, onClick, isActive } = props;

  return (
    <li
      className={cn(
        "cursor-default rounded-xl p-4 flex space-x-2 items-center h-[80px]",
        isActive ? "bg-white" : "hover:bg-white/[0.4] ",
      )}
      onClick={onClick}
    >
      <figure
        className={"w-8 aspect-square bg-gray-200 rounded-full shrink-0"}
      >
        <img src={data.users[0].avatar} />
      </figure>
      <div className={"flex-1 "}>
        <div className={"flex justify-between"}>
          <p>{data.title}</p>{" "}
          <span className={"-mr-2 text-xs opacity-75"}>
            {data.format_timestamp}
          </span>
        </div>
        <p
          className={
            "text-muted-foreground text-xs overflow-ellipsis overflow-hidden"
          }
        >
          {data.last_message}
        </p>
      </div>
    </li>
  );
}

function ComposeMessage(props: { channelId: string }) {
  const { sendMessage } = useChat();

  const [text, setText] = React.useState("");
  const { typing, startTyping } = useTyping(
    props.channelId,
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
                channel_id: props.channelId,
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

function safeString(a: unknown) {
  return typeof a === "string" ? a : "";
}

function MessageBoxHeader() {
  const { channel } = useChat();

  if (channel.channel_type === "none") return;

  return (
    <div
      className={
        "p-[--space-x] py-[--space-y] flex justify-between items-center"
      }
    >
      <div className={"space-x-2 flex"}>
        <figure className={"w-12 h-12 rounded-lg bg-gray-200"}>
          <img src={channel.users[0].avatar} />
        </figure>

        <div className={"flex flex-col flex-1 space-y-1"}>
          <p className={"text-base items-center space-x-2 flex"}>
            <span className={"inline-flex"}>
              {safeString(channel.title)
                .split("@")
                .map((e) => {
                  return e === "" ? (
                    <span key={"symbol"} className={"text-muted-foreground"}>
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

          <p className={"text-xs text-muted-foreground"}>Joined 13 days ago</p>
        </div>
      </div>
      <span className={"italic text-sm bg-gray-50 px-2 py-1 rounded-full "}>
        For your safety do not share <b>contact</b> information
      </span>
    </div>
  );
}

const colors = ["dodgerblue", "orange", "babypink"];
