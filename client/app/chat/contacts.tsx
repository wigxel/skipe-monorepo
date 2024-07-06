import { CardHeader, CardTitle } from "~/components/ui/card";
import { Scrollbar } from "~/app/vendor/scroll-bar";
import React from "react";
import { cn } from "~/lib/utils";

export function ChatChannels(props: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn("w-3/12 flex flex-col max-h-[100%] px-4", props.className)}
    >
      <CardHeader className={"flex-shrink-0 pl-2"}>
        <CardTitle>Conversations</CardTitle>
      </CardHeader>

      <div className={"border-t"} />

      <div className={"flex-1 -mr-4 -ml-2"}>
        <Scrollbar>
          <aside className={"overflow-hidden py-2 pr-4"}>
            {props.children}
          </aside>
        </Scrollbar>
      </div>
      <div className={"py-2 shrink-0"} />
    </div>
  );
}
