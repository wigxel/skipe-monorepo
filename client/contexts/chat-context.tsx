import { initialize } from "~/core/chat";
import React from "react";
import { app } from "~/lib/firebase.config";
import { Channel, parseChannel } from "~/core/channel";

type CtxValue = ReturnType<typeof initialize> & {
  channel_id: string;
  channel: Channel;
  switchChannel: (channel_id: Channel) => void;
};

const Ctx = React.createContext<CtxValue>({
  channel: { channel_type: "none" },
} as CtxValue);

export function ChatProvider(props: {
  app: typeof app;
  children?: React.ReactNode;
}) {
  const value = React.useMemo(
    () =>
      initialize(props.app, {
        user_id: "6fb80cfa-e5f4-4819-8837-f55698e3dc7b",
      }),
    [props.app],
  );

  const [channel, switchChannel] = React.useState<Channel>(() => {
    try {
      return parseChannel(JSON.parse(localStorage.getItem("channel")));
    } catch {
      return parseChannel({ channel_type: "none" });
    }
  });

  const channel_id: string = channel.channel_type !== "none" ? channel.id : "";

  React.useEffect(
    function persistChannelOnChange() {
      localStorage.setItem("channel", JSON.stringify(channel));
    },
    [channel],
  );

  return (
    <Ctx.Provider value={{ channel_id, switchChannel, channel, ...value }}>
      {props.children}
    </Ctx.Provider>
  );
}

export function useChat() {
  return React.useContext(Ctx);
}
