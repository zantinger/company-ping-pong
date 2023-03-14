import { useState, useEffect, useContext } from "react";
import { SocketContext } from "./App";
import { switchMap, map, fromEvent, distinctUntilChanged } from "rxjs";

export const useSubscription = (source$, nextHandler) => {
  useEffect(() => {
    if (source$) {
      const sub = source$.subscribe({
        next: nextHandler,
        complete: console.warn,
        error: console.error,
      });
      return () => {
        sub.unsubscribe();
      };
    }
  }, [source$]);
};

export const useObservable = (source$, initial) => {
  const [value, setValue] = useState(initial);

  useSubscription(source$, setValue);

  return value;
};

export const useSocketEmiter = (observable$, nextHandler) => {
  const socket$ = useContext(SocketContext);

  return useSubscription(
    socket$.pipe(
      switchMap((socket) =>
        observable$.pipe(map((data) => ({ socket, data })))
      ),
      distinctUntilChanged()
    ),
    nextHandler
  );
};

// https://socket.io/docs/v4/client-api/#event-connect
// you shouldn't register event handlers in the connect handler itself
export const useSocketListener = (event, initial) => {
  const socket$ = useContext(SocketContext);

  return useObservable(
    socket$.pipe(switchMap((socket) => fromEvent(socket, event))),
    initial
  );
};
