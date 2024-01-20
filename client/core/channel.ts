type User = {
  name: "Kelvin";
};

// Group & Direct
type Channel = GroupChannel | DirectChannel;

export function ChannelFactory(data: unknown): Channel | { type: "None" } {
  if (["direct", "group"].includes(data?.channel_type)) return { type: "None" };

  if (data.channel_type === "group") return GroupChannel(data);

  return DirectChannel(data);
}

type GroupChannel = {
  id: string;
  channel_type: "group";
  group_name: "";
  users: User[];
  last_message: string;
  timestamp: Date;
};

function GroupChannel(data: unknown): GroupChannel {
  return {
    type: "GroupChannel",
  };
}

export type DirectChannel = {
  id: string;
  channel_type: "direct";
  users: User[];
  last_message?: string | null;
  timestamp: Date;
};

function DirectChannel(data: unknown): DirectChannel {
  return {
    id: data.id,
    timestamp: new Date(data.timestamp),
    channel_type: "direct",
    last_message: data?.last_message,
    users: data?.users ?? [],
  };
}
