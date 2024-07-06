import { useChat } from "~/contexts/chat-context";
import React from "react";
import { useMessageSubscription } from "~/hooks/use-message-subscription";
import { safeArray } from "~/lib/utils";
import { MessagesBox } from "~/components/chat/message-scroll-container";
import { MessageBubble } from "~/components/chat/message-bubble";

export const MOCKS = {
  SENDER_ID: "some-random-id",
  RECEIVED_ID: "some-other-id",
  CHANNEL_ID: "ADTje3HqNuGrkj68imYr",
};

export function ChatMessages() {
  const { channel_id } = useChat();
  const [channelMessageMap, setChannelMessageMap] = React.useState({
    [channel_id ?? "default"]: [],
  });

  useMessageSubscription(channel_id, (event) => {
    console.log(event);
    setChannelMessageMap((store) => ({
      ...store,
      [channel_id]: [...safeArray(store[channel_id]), ...event],
    }));
  });

  return (
    <div className={"relative flex-1"}>
      {Object.entries(channelMessageMap).map(([local_channel_id, messages]) => {
        const is_active = channel_id === local_channel_id;

        if (is_active)
          console.log(local_channel_id, channel_id, messages.length);

        return (
          // <Scrollbar key={local_channel_id}>
          <MessagesBox
            key={local_channel_id}
            getScrollContainer={(target) => {
              return target.parentElement;
            }}
          >
            <div
              className={
                "overflow-y-scroll border-y bg-orange-200 absolute inset-0 flex-1 border-gray-50 px-4"
              }
              style={
                is_active
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
                      message.recipient === MOCKS.SENDER_ID ? "right" : "left"
                    }
                    {...message}
                  />
                );
              })}
            </div>
          </MessagesBox>
          // </Scrollbar>
        );
      })}
    </div>
  );
}
