import { randomUUID } from "uncrypto";

type UserId = string; // uuid // zod.brand

export interface Message {
  id: string;
  message: string;
  created_at: string;
  updated_at: string;
  recipient: UserId;
  image: { src: string; alt: string };
}

function MessageFactory(payload): Message {
  return {
    type: "Message",
    ...payload,
  };
}

export function createMessage(
  params: Pick<Message, "message" | "recipient"> &
    Partial<Omit<Message, "message" | "recipient">>,
): Message {
  const { message, recipient, image, ...prop } = params;

  return MessageFactory({
    ...prop,
    message,
    recipient,
    id: randomUUID(),
    image: image ?? [],
    created_at: new Date().toISOString(),
    updated_at: null,
  });
}

export function enrichMessage(payload) {
  if (payload.id) throw new Error("Message missing `id`");

  return MessageFactory(payload);
}

const msg = createMessage({ message: "Hi", recipient: "someone-random-id" });
const existing_msg = enrichMessage({
  message: "Hi",
  created_at: new Date().toISOString(),
  recipient: "some-random-id",
  image: [],
});
