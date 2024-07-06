"use client";
import React from "react";
import { ChatMessages } from "~/app/chat/messages";
import { ChatArea } from "~/app/chat/chat-area";
import { ChatChannels } from "~/app/chat/contacts";
import { ChatRoot } from "~/app/chat/chat-root";
import { NoChannel } from "~/app/chat/empty-states";
import { ChatChannelList } from "~/app/chat/chat-channel-list";
import { ChatComposeMessage } from "~/app/chat/chat-message-composer";
import { ChatHeader } from "~/app/chat/chat-header";

export default function ChatPage_() {
  return (
    <div
      className={
        "py-4 px-4 container flex flex-col flex-1 items-start justify-center"
      }
    >
      <ChatPage />{" "}
    </div>
  );
}

function ChatPage() {
  return (
    <ChatRoot className={"border bg-gray-100 rounded-2xl"}>
      <ChatChannels className={"max-w-[350px]"}>
        <NoChannel>
          <div className={"py-6"}>
            <p className={"text-muted-foreground px-4"}>No contacts...</p>
          </div>
        </NoChannel>
        <ChatChannelList />
      </ChatChannels>

      <ChatArea className={"shadow rounded-xl mt-2 mr-2 mb-2"}>
        <ChatHeader />
        <ChatMessages />
        <ChatComposeMessage />
      </ChatArea>
    </ChatRoot>
  );
}
