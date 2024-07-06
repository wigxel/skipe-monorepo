import React from "react";
import { Channel } from "~/core/channel";
import { cn } from "~/lib/utils";
import Image from "next/image";
import { Skeleton } from "~/components/ui/skeleton";

export function Contact(
  props: React.ComponentProps<"li"> & {
    data: Exclude<Channel, { channel_type: "none" }>;
    isActive?: boolean;
    children?: React.ReactNode;
  },
) {
  const { data, onClick, isActive } = props;

  return (
    <li
      className={cn(
        "cursor-default rounded-xl p-4 flex space-x-2 items-center h-[80px]",
        isActive ? "bg-white" : "hover:bg-white/[0.4] ",
      )}
      onClick={onClick}
    >
      <figure
        className={
          "w-8 aspect-square bg-gray-200 rounded-full shrink-0 overflow-hidden"
        }
      >
        <Image
          alt={data.title}
          width={50}
          height={50}
          src={
            data.channel_type == "direct"
              ? data.getAvatar("0")
              : data.getAvatar()
          }
          className={"object-cover"}
        />
      </figure>
      <div className={"flex-1 "}>
        <div className={"flex justify-between"}>
          <p>{data.title}</p>{" "}
          <span className={"-mr-2 text-xs opacity-75"}>
            {data.format_timestamp}
          </span>
        </div>
        <p
          className={
            "text-muted-foreground text-xs overflow-ellipsis overflow-hidden"
          }
        >
          {data.last_message}
        </p>
      </div>
    </li>
  );
}

export function ContactSkeleton() {
  return (
    <span
      role={"status"}
      className={cn("p-4 flex space-x-2 items-center h-[80px]")}
    >
      <Skeleton
        className={
          "w-12 aspect-square bg-gray-200 rounded-full shrink-0 overflow-hidden"
        }
      />
      <div className={"flex-1 flex flex-col gap-1"}>
        <div className={"flex justify-between flex-1 gap-2"}>
          <Skeleton className={"bg-gray-200 text-base flex-1 h-[16px]"} />
          <Skeleton className={"-mr-2 w-2/12 bg-gray-200 h-[16px] text-xs"} />
        </div>
        <Skeleton className={"text-xs w-3/4 bg-gray-200 h-[16px]"}></Skeleton>
      </div>
    </span>
  );
}
