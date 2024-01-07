"use client";
import { Observable, Observer } from "rxjs";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { Message } from "~/core/message";
import { onSnapshot } from "firebase/firestore";
import React from "react";

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

    return await setDoc(document, data);
  }

  function onNewMessage({ channel_id }: { channel_id: string }) {
    const path = `channels/${channel_id}/messages`;
    const collection_ref = collection(db, path);

    const unsubscribe = onSnapshot(
      collection_ref,
      (doc) => {
        doc.docChanges().forEach((doc) => {
          console.log("Current data:", doc.type, doc.doc.data());
        });
      },
      (err) => {
        console.log(err);
      },
    );

    return () => {
      console.log(`unsubscribing from ${path}`);
      unsubscribe();
    };
  }

  /** Returns an observable that sends typing events **/
  function onTyping(params: { channel_id: string; user_id: string }) {
    return new Observable<{
      type: "modified" | "added";
      data: { user_id: string; typing: boolean };
    }>((subscriber) => {
      const { channel_id } = params;

      const path = `channels/${channel_id}/activity`;

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
              subscriber.next({ type: rec.type, data: rec.doc.data() });
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

  return { loadMessages, onNewMessage, sendMessage, onTyping };
}

export function useSubscription<TObservable extends Observable<B>, B = {}>(
  observable: TObservable,
  callbackFn: (
    evt: TObservable extends Observable<infer B> ? B : unknown,
  ) => void,
) {
  React.useEffect(() => {
    const unsubFn = observable.subscribe(callbackFn);

    return () => {
      unsubFn.unsubscribe();
    };
  }, [observable, callbackFn]);
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
