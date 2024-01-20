"use client";
import { catchError, Observable, of } from "rxjs";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { enrichMessage, Message } from "~/core/message";
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

  function newMessages$({ channel_id }: { channel_id: string }) {
    return new Observable<Message>((subscriber) => {
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

  async function loadChannels() {
    const ref = collection(db, `channels`);
    const snapshot = await getDocs(ref);
    console.log(
      "Channels",
      snapshot.docs.map((doc) => {
        return doc.data();
      }),
    );
  }
  // function newMessages$() {
  //   return new Observable((subscriber) => {
  //     let id;
  //
  //     interval(40)
  //       .pipe(takeUntil(timer(2000)))
  //       .subscribe({
  //         next: () =>
  //           subscriber.next(
  //             enrichMessage(
  //               createMessage({
  //                 message: randomUUID(),
  //                 recipient: "some-other-id",
  //               }),
  //             ),
  //           ),
  //         complete: () => {
  //           id = setInterval(() => {
  //             subscriber.next(
  //               enrichMessage(
  //                 createMessage({
  //                   message: randomUUID(),
  //                   recipient: "some-random-id",
  //                 }),
  //               ),
  //             );
  //           }, 5000);
  //         },
  //       });
  //
  //     return () => {
  //       clearInterval(id);
  //     };
  //   });
  // }

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

  return {
    loadMessages,
    loadChannels,
    setActivityState,
    newMessages$,
    sendMessage,
    onTyping,
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
