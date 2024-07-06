import { useChat } from "~/contexts/chat-context";
import Image from "next/image";
import { safeString } from "~/lib/utils";
import { ShieldCheck } from "lucide-react";
import React from "react";

export function ChatHeader() {
  const { channel } = useChat();

  if (channel.channel_type === "none") return;

  return (
    <div
      className={
        "p-[--space-x] py-[--space-y] flex justify-between items-center"
      }
    >
      <div className={"space-x-2 flex"}>
        <figure className={"w-12 h-12 rounded-lg overflow-hidden bg-gray-200"}>
          <Image
            alt={channel.title}
            width={100}
            height={100}
            src={
              channel.channel_type == "direct"
                ? channel.getAvatar("0")
                : channel.channel_type === "group"
                  ? channel.getAvatar()
                  : null
            }
            className={"object-fit"}
          />
        </figure>

        <div className={"flex flex-col flex-1 space-y-1"}>
          <p className={"text-base items-center space-x-2 flex"}>
            <span className={"inline-flex"}>
              {safeString(channel.title)
                .split("@")
                .map((e) => {
                  return e === "" ? (
                    <span key={"symbol"} className={"text-muted-foreground"}>
                      @
                    </span>
                  ) : (
                    <span key="name" className={"font-medium"}>
                      {e}
                    </span>
                  );
                })}
            </span>

            {true ? (
              <ShieldCheck color={"limegreen"} size={"1em"}>
                Verified
              </ShieldCheck>
            ) : null}
          </p>

          {channel.channel_type === "group" ? (
            <div className={"text-xs text-muted-foreground"}>
              {/* Pluralize */}
              <span>{channel.users.length} members</span>
            </div>
          ) : (
            <p className={"text-xs text-muted-foreground"}>
              Joined 13 days ago
            </p>
          )}
        </div>
      </div>
      <span className={"italic text-sm bg-gray-50 px-2 py-1 rounded-full "}>
        For your safety do not share <b>contact</b> information
      </span>
    </div>
  );
}
