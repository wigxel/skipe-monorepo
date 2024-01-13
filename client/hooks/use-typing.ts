import { filter, Observable } from "rxjs";
import React from "react";
import { useSubscription } from "~/core/chat";
import debounce from "lodash/debounce";
import { useChat } from "~/contexts/chat-context";

type ObservableEvent<T extends Observable<unknown>> = T extends Observable<
  infer TB
>
  ? TB
  : unknown;

export function useTyping(channel_id: string, user_id: string) {
  const { onTyping, setActivityState } = useChat();

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

  const stopTyping = React.useMemo(() => {
    return debounce(() => {
      console.log("useTyping > Stopped Typing...");
      return setActivityState({
        activity: { typing: false },
        user_id,
        channel_id,
      });
    }, 2000);
  }, [channel_id, setActivityState, user_id]);

  function startTyping() {
    console.log("useTyping > Typing...");
    return setActivityState({
      activity: { typing: true },
      user_id,
      channel_id,
    }).then(stopTyping);
  }

  return { typing, startTyping };
}

