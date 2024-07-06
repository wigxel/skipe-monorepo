import React from "react";
import { useChat } from "~/contexts/chat-context";
import { cn } from "~/lib/utils";

export function ChatArea(props: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { channel } = useChat();

  const className = cn(
    "flex-1 flex z-20 relative flex-col bg-white [--space-x:1rem] [--space-y:0.5rem]",
    props.className,
  );

  return (
    <>
      {channel.channel_type === "none" ? (
        <section className={className}>
          <p>No Contact</p>
        </section>
      ) : (
        <section className={className}>{props.children}</section>
      )}
    </>
  );
}
