import { formatDistance, isValid } from "date-fns";

type User = {
  name: string;
  username: `@${string}`;
};

type MessageBase = {
  title: string;
  timestamp: Date;
  format_timestamp: string;
  last_message?: null | string;
};

type NoChannel = { channel_type: "none" };

type GroupChannel = MessageBase & {
  id: string;
  channel_type: "group";
  group_name: string;
  users: User[];
};

export type DirectChannel = MessageBase & {
  id: string;
  channel_type: "direct";
  users: User[];
  timestamp: Date;
};

// Group & Direct
export type Channel = GroupChannel | DirectChannel | NoChannel;

export function ChannelFactory(data: Record<string, unknown>): Channel {
  if (!["direct", "group"].includes(<string>data?.channel_type))
    return { channel_type: "none" };

  if (data.channel_type === "group") return GroupChannel(data);

  return DirectChannel(data);
}

function GroupChannel(data: Record<string, unknown>): GroupChannel {
  return {
    id: <string>data?.channel_id,
    channel_type: "group",
    group_name: <string>data?.group_name || "--",
    users: JSON.parse(<string>data?.users) ?? [],
    last_message: <string>data?.last_message ?? null,
    // @ts-expect-error
    timestamp: new Date((data?.timestamp?.seconds || 0) * 1000),
    get title() {
      return this.group_name;
    },
    get format_timestamp() {
      return format_timestamp(this.timestamp);
    },
  };
}

function DirectChannel(data: Record<string, unknown>): DirectChannel {
  return {
    id: <string>data?.channel_id ?? "",
    // @ts-expect-error Needs refactor
    timestamp: new Date((data?.timestamp?.seconds || 0) * 1000),
    channel_type: "direct",
    last_message: <string>data?.last_message,
    users: JSON.parse(<string>data?.users), //
    get title() {
      const other_user = this.users[0]; // TODO: Find the other user
      return other_user.name;
      // return this.users.find(user => user.id === ownerId ? user.name :)
    },
    get format_timestamp() {
      return format_timestamp(this.timestamp);
    },
  };
}

function format_timestamp(timestamp: Date) {
  if (!isValid(timestamp)) return "--";

  return formatDistance(timestamp, new Date());
}
