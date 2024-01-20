type User = {
  name: "Kelvin";
};

// Group & Direct
type Channel = GroupChannel | DirectChannel;

export function ChannelFactory(data: unknown): Channel | { type: "None" } {
  // console.log(JSON.stringify(data));
  if (!["direct", "group"].includes(data?.channel_type)) return { type: "None" };

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
    id: data?.channel_id, 
    channel_type: "group",
    group_name: data?.group_name,
    users: JSON.parse(data?.users),
    last_message: data?.last_message, 
    timestamp: new Date((data?.timestamp?.seconds || 0) * 1000),
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
    id: data?.channel_id,
    timestamp: new Date((data?.timestamp?.seconds || 0) * 1000),
    channel_type: "direct",
    last_message: data?.last_message,
    users: JSON.parse(data?.users),
  };
}
