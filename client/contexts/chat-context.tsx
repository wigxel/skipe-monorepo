"use client";
import { initialize } from "~/core/chat";
import React from "react";
import { app } from "~/lib/firebase.config";
import { ValidChannel, Channel, parseChannel } from "~/core/channel";
import { useLoading } from "~/hooks/use-async-loader";

type CtxValue = ReturnType<typeof initialize> & {
  loading: { channels: boolean };
  channel_id: string;
  channel: Channel;
  channels: ValidChannel[];
  switchChannel: (channel_id: Channel) => void;
};

const Ctx = React.createContext<CtxValue>({
  channel: { channel_type: "none" },
} as CtxValue);

export function ChatProvider(props: {
  app: typeof app;
  children?: React.ReactNode;
}) {
  const chatInstance = React.useMemo(
    () =>
      initialize(props.app, {
        user_id: "6fb80cfa-e5f4-4819-8837-f55698e3dc7b",
      }),
    [props.app],
  );

  const [channels, setChannels] = React.useState<ValidChannel[]>([]);
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

  const asyncLoader = useLoading({ channels: false });

  React.useEffect(() => {
    const abort = new AbortController();
    asyncLoader.startLoading("channels");
    chatInstance
      .loadChannels({ signal: abort.signal })
      .then((channels) => {
        const valid_channels = channels.filter(
          (e) => e.channel_type !== "none",
        ) as ValidChannel[];
        setChannels(valid_channels);
      })
      .catch((reason) => {
        console.error(`Error fetching channels: ${reason.message}`);
      })
      .finally(() => {
        initial_status = "pending";
        asyncLoader.stopLoading("channels");
      });

    return () => {
      abort.abort("Unsubscribing from Context");
    };
  }, []);

  return (
    <Ctx.Provider
      value={{
        loading: asyncLoader.loading,
        channel_id,
        switchChannel,
        channels,
        channel,
        ...chatInstance,
      }}
    >
      {props.children}
    </Ctx.Provider>
  );
}

let initial_status = "pending";

export function useChat() {
  return React.useContext(Ctx);
}
