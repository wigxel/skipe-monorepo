import React from "react";
import { ChatProvider } from "~/contexts/chat-context";
import { app } from "~/lib/firebase.config";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export function ChatRoot(props: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <ChatProvider app={app}>
      <Card
        className={cn(
          "mx-auto w-full p-0 flex flex-1 max-h-screen items-stretch",
          props.className,
        )}
      >
        {props.children}
      </Card>
    </ChatProvider>
  );
}
