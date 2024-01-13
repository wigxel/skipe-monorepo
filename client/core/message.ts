import { randomUUID } from "uncrypto";
import { format, parseISO } from "date-fns";

type UserId = string; // uuid // zod.brand

export interface Message {
  id: string;
  message: string;
  created_at: string;
  updated_at: string;
  recipient: UserId;
  image: { src: string; alt: string };
  timestamp: string;
}

function MessageFactory(payload): Message {
  return {
    type: "Message",
    ...payload,
    get timestamp() {
      try {
        return format(parseISO(this.created_at), "hh:mm dd MM YYY");
      } catch (err) {
        return "--";
      }
    },
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
  if (!payload.id) {
    const err = new Error("Message missing `id`");
    console.log("Payload", payload);

    throw err;
  }

  return MessageFactory(payload);
}

const msg = createMessage({ message: "Hi", recipient: "someone-random-id" });
const existing_msg = enrichMessage({
  id: "someone-sample",
  message: "Hi",
  created_at: new Date().toISOString(),
  recipient: "some-random-id",
  image: [],
});
