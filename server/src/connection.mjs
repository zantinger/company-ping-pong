import { of, fromEvent } from "rxjs";
import { map, switchMap, mergeMap, takeUntil } from "rxjs/operators";
import { io } from "./server.mjs";

const io$ = of(io);

export const connection$ = io$.pipe(
  switchMap((io) =>
    fromEvent(io, "connection").pipe(map((client) => ({ io, client })))
  )
);

export const listenOnDisconnect$ = connection$.pipe(
  mergeMap(({ io, client }) =>
    fromEvent(client, "disconnect").pipe(map((_) => ({ io, client })))
  )
);

export const listenOnConnect = (event) => {
  return connection$.pipe(
    mergeMap(({ io, client }) =>
      fromEvent(client, event).pipe(
        takeUntil(fromEvent(client, "disconnect")),
        map((data) => ({ io, client, data }))
      )
    )
  );
};
