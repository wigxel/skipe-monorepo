import { Message } from "~/core/message";
import { useChat } from "~/contexts/chat-context";
import React from "react";
import { bufferTime } from "rxjs";
import { useSubscription } from "~/hooks/use-subscription";

export function useMessageSubscription(
  channel_id: string,
  callback: (event: Message[]) => void,
) {
  const { newMessages$ } = useChat();

  useSubscription(
    React.useMemo(
      () => newMessages$({ channel_id }).pipe(bufferTime(500)),
      [channel_id, newMessages$],
    ),
    (event) => {
      if (event.length === 0) return;
      callback(event);
    },
  );
}
