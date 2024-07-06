import React from "react";
import { useChat } from "~/contexts/chat-context";

export function NoChannel(props: { children: React.ReactNode }) {
  const {
    loading: { channels: isLoading },
    channels,
  } = useChat();

  const showChildren = channels.length === 0 && isLoading === true;

  if (!showChildren) return null;

  return props.children;
}
