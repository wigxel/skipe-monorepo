import { useChat } from "~/contexts/chat-context";
import React from "react";
import { useTyping } from "~/hooks/use-typing";
import { MOCKS } from "~/app/chat/messages";
import { ChatMessageBox } from "~/components/chat/message-box";
import { Button } from "~/components/ui/button";
import { createMessage } from "~/core/message";
import { SendIcon } from "lucide-react";

export function ChatComposeMessage() {
  const { channel_id, sendMessage, getSenderId } = useChat();

  const [text, setText] = React.useState("");
  const { typing, startTyping } = useTyping(
    channel_id,
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
                channel_id: channel_id,
                message: createMessage({
                  message: text,
                  recipient: getSenderId(),
                }),
                receiver_id: null,
                sender_id: getSenderId(),
              });
              setText("");
            } catch (err) {
              console.error(err);
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
