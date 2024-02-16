"use client";
import { Observable } from "rxjs";
import {
  and,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { enrichMessage, Message } from "~/core/message";
import { ChannelFactory_, User, UserFactory } from "~/core/channel";
import { randomUUID } from "uncrypto";
import { safeArray } from "~/lib/utils";

export function initialize(app: any, config: { user_id: string }) {
  const { user_id } = config;

  const db = getFirestore(app);

  async function loadMessages(channel_id: string, config: { limit: 50 }) {
    const ref = collection(db, `channels/${channel_id}/messages`);

    const snapshot = await getDocs(ref);
    return snapshot.docs.map((doc) => {
      return {
        messageId: doc.id,
        ...doc.data(),
      };
    });
  }

  async function sendMessage(params: {
    sender_id: string;
    receiver_id: string | null;
    channel_id: string;
    message: Message;
  }) {
    const msg_id = params.message.id;
    const is_participant = await isUserChannelMember({
      channel_id: params.channel_id,
      user_id: params.sender_id,
    });

    if (!is_participant) {
      throw new Error(
        "This member isn't a part of the group. So they should be allowed to send a message",
      );
    }

    const document = doc(
      db,
      `channels/${params.channel_id}/messages/${msg_id}`,
    );
    const data = params.message;

    await setDoc(document, data);
    return;
  }

  async function isUserChannelMember(config: {
    user_id: string;
    channel_id: string;
  }) {
    const { user_id, channel_id } = config;

    const ref = query(
      collection(db, "channels"),
      and(
        where("user_ids", "array-contains", user_id),
        where("channel_id", "==", channel_id),
      ),
    );

    const count = await getCountFromServer(ref);

    return count.data().count > 0;
  }

  function newMessages$({ channel_id }: { channel_id: string }) {
    return new Observable<Message>((subscriber) => {
      if (!channel_id) return () => {};

      const path = Paths.message(channel_id);
      const collection_ref = query(
        collection(db, path),
        orderBy("created_at", "asc"),
      );

      const unsubscribe = onSnapshot(
        collection_ref,
        (doc) => {
          doc.docChanges().forEach((doc) => {
            try {
              subscriber.next(
                enrichMessage({ id: doc.doc.id, ...doc.doc.data() }),
              );
            } catch (err) {
              subscriber.error(err);
            }
          });
        },
        (err) => subscriber.error(err),
      );

      return () => {
        console.log(`unsubscribing from ${path}`);
        unsubscribe();
      };
    });
  }

  let loading = false;
  async function loadChannels() {
    if (loading) return [];

    loading = true;
    try {
      const channels_ref = collection(db, `channels`);
      const ref = query(
        channels_ref,
        where("user_ids", "array-contains", user_id),
      );
      const snapshot = await getDocs(ref);
      return await Promise.all(
        snapshot.docs.map(async (doc) => {
          const channel_data = doc.data();
          const users = [];

          for await (const ref of safeArray(channel_data.users)) {
            users.push((await getDoc(ref)).data());
          }

          return ChannelFactory_.create(
            Object.assign(channel_data, {
              users,
            }),
          );
        }),
      );
    } catch (err) {
      console.error("Error loading channels", err.message);
    } finally {
      loading = false;
    }
  }

  async function registerUser(user_data: User) {
    const ref = doc(db, `users/${user_data.id}`);
    return setDoc(ref, user_data);
  }

  /** Returns an observable that sends typing events **/
  function onTyping(params: { channel_id: string; user_id: string }) {
    type TypingEvent = {
      type: "modified" | "added";
      data: { user_id: string; typing: boolean };
    };

    return new Observable<TypingEvent>((subscriber) => {
      const { channel_id } = params;

      const path = Paths.activity_path(channel_id);

      // listen for everyone except mine
      const ref = query(
        collection(db, path),
        where("user_id", "!=", params.user_id),
      );

      const unsubscribe = onSnapshot(
        ref,
        (doc) => {
          for (const rec of Array.from(doc.docChanges())) {
            if (["added", "modified"].includes(rec.type)) {
              subscriber.next({
                type: rec.type,
                data: rec.doc.data(),
              } as TypingEvent);
            }
          }
        },
        subscriber.error,
      );

      return () => {
        console.log(`unsubscribing from ${path}`);
        unsubscribe();
      };
    });
  }

  async function setActivityState(params: {
    channel_id: string;
    user_id: string;
    activity: { typing: boolean };
  }) {
    const path = `${Paths.activity_path(params.channel_id)}/${params.user_id}`;
    const document = doc(db, path);
    const is_typing = params.activity.typing;
    const data = {
      typing: is_typing,
      user_id: params.user_id,
    };

    return await setDoc(document, data);
  }

  function runSeed() {
    const promise = Promise.all(
      [
        UserFactory.create({
          id: randomUUID(),
          username: "@johnny.mill",
          name: "Johnny Mill",
          avatar: "https://ui-avatars.com/api/?name=Wonka+Group",
        }),
        UserFactory.create({
          id: randomUUID(),
          username: "@wick.group",
          name: "Wick",
          avatar: "https://ui-avatars.com/api/?name=Wick+Morgan",
        }),
      ].map((data) => registerUser(data)),
    );

    return promise;
  }

  function getSenderId() {
    return user_id;
  }

  return {
    loadMessages,
    loadChannels,
    setActivityState,
    newMessages$,
    sendMessage,
    getSenderId,
    onTyping,
    runSeed,
  };
}

const Paths = {
  message(channel_id: string) {
    return `channels/${channel_id}/messages`;
  },
  activity_path(channel_id: string) {
    return `channels/${channel_id}/activity`;
  },
};
