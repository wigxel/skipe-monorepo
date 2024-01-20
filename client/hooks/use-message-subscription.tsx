import { Message } from "~/core/message";
import { useChat } from "~/contexts/chat-context";
import { useSubscription } from "~/core/chat";
import React, { useEffect } from "react";
import { bufferTime } from "rxjs";

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
