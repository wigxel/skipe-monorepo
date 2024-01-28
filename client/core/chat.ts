"use client";
import { catchError, Observable, of } from "rxjs";
import {
  collection,
  doc,
  DocumentReference,
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
import {
  ChannelFactory,
  ChannelFactory_,
  User,
  UserFactory,
} from "~/core/channel";
import React from "react";
import { randomUUID } from "uncrypto";
import { safeArray } from "~/lib/utils";

export function initialize(app: any) {
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
    senderId: string;
    receiverId: string;
    channel_id: string;
    message: Message;
  }) {
    const msg_id = params.message.id;
    const document = doc(
      db,
      `channels/${params.channel_id}/messages/${msg_id}`,
    );
    const data = params.message;

    await setDoc(document, data);
    return;
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
  async function loadChannels(user_id: string) {
    if (loading) return;
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

  function getChannelUser(user_id: string) {
    const ref = doc(db, "users", user_id);

    return getDoc(ref).then((e) => e.data());
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

  return {
    loadMessages,
    loadChannels,
    setActivityState,
    newMessages$,
    sendMessage,
    onTyping,
    runSeed,
  };
}

export function useSubscription<TObservable extends Observable<B>, B = {}>(
  observable: TObservable,
  callbackFn: (
    evt: TObservable extends Observable<infer B> ? B : unknown,
  ) => void,
) {
  React.useEffect(() => {
    const unsubFn = observable
      .pipe(
        catchError((err) => {
          console.log("Subscription failed", err);
          return of({ type: "Null" });
        }),
      )
      .subscribe(callbackFn);

    return () => {
      unsubFn.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observable]);
}

const list_recipients = {
  "some-random-id": { name: "John snow", active: false },
  "some-random-id-2": { name: "Alice Walker", active: false },
};

const messages = [
  { message: "Hi John", recipient: "some-random-id", timestamp: Date.now() },
  { message: "Frankly", recipient: "some-random-id-2", timestamp: Date.now() },
];

// list of channels
// -> each channel contains messages
// -> every message has recipient

`/channel-id/messages`;
const record = {
  "channel-id": messages, // 1,000,000,0000 -> 2 recipient
};

const root = {
  channels: [
    {
      id: "ADTje3HqNuGrkj68imYr",
      name: "Tokunbo",
      timestamp: "",
      messages: [
        {
          id: "4UvRqcZewBZJkqU5JI3c",
          message: "Hello",
          recipient: "some-random-uuid",
        }, // John
        {
          id: "N4frah4rwJxjhOdd8ugr",
          message: "Hi",
          recipient: "some-random-uuid",
        }, // Alice
      ],
    },
  ],
};

const Paths = {
  message(channel_id: string) {
    return `channels/${channel_id}/messages`;
  },
  activity_path(channel_id: string) {
    return `channels/${channel_id}/activity`;
  },
};
