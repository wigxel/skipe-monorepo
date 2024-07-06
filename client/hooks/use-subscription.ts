"use client";
import { catchError, Observable, of } from "rxjs";
import React from "react";

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
          console.log("Subscription failed. Returning empty results", err);
          return of([]);
        }),
      )
      .subscribe(callbackFn);

    return () => {
      unsubFn.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observable]);
}
