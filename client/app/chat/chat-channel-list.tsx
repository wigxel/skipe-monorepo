import { useChat } from "~/contexts/chat-context";
import { SkeletonList } from "~/app/chat/skeleton-list";
import { Contact, ContactSkeleton } from "~/app/chat/contact";
import React from "react";

export function ChatChannelList() {
  const {
    loading: { channels: isLoading },
    channel_id,
    channels: contacts,
    switchChannel,
  } = useChat();

  if (isLoading)
    return (
      <SkeletonList count={6}>
        <ContactSkeleton />
      </SkeletonList>
    );

  return (
    <>
      {contacts.map((channel) => {
        return (
          <Contact
            key={channel.id}
            data={channel}
            isActive={channel_id === channel.id}
            onClick={() => {
              switchChannel(channel);
            }}
          />
        );
      })}
    </>
  );
}
