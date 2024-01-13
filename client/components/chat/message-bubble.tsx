import messages from "~/app/chat/data.json";
import { cn } from "~/lib/utils";
import React from "react";
import { Message } from "~/core/message";

export function MessageBubble(props: Message & { position: "left" | "right" }) {
  const isLeft = props.position === "right";
  const isOwner = !!isLeft;

  return (
    <li
      key={props.id}
      className={cn("flex items-end pe-4 gap-x-1 py-2")}
      style={{
        direction: isLeft ? "rtl" : "ltr",
      }}
    >
      <span
        className={cn("w-4 h-4 rounded-full pe-4 bg-blue-500", {
          "bg-orange-500": isLeft,
        })}
      />
      <div
        className={cn("p-2  max-w-[50%] text-sm rounded-2xl text-start", {
          "rounded-br-md bg-gray-100 text-gray/50": isLeft,
          "rounded-bl-md bg-purple-50 text-gray-800": !isLeft,
        })}
        style={{ direction: "ltr" }}
      >
        {isOwner ? null : (
          <span className={"opacity-50 text-xs"}>{props.recipient}</span>
        )}
        <p>{props.message}</p>
        <p className={"text-xs self-end text-muted-foreground"}>
          <span style={{ direction: "ltr" }}>{props.timestamp}</span>
        </p>
      </div>
    </li>
  );
}
