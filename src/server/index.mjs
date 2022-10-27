import { map, switchMap } from "rxjs/operators";
import {
  connection$,
  listenOnConnect,
  listenOnDisconnect$,
} from "./connection.mjs";
import { httpServer } from "./server.mjs";
import { RoomState } from "./state.mjs";

const roomService = new RoomState();

// When user connects or new room is created, rooms will be emited.
connection$
  .pipe(
    switchMap(({ io, client }) =>
      roomService.rooms$.pipe(map((rooms) => ({ io, client, rooms })))
    )
  )
  .subscribe(({ io, rooms }) => {
    io.emit("available rooms", rooms);
  });

listenOnDisconnect$.subscribe(({ client }) => {
  const { user, room } = client.data;
  if (room) {
    roomService.removeUserFromRoom({ user, room });
  }
});

listenOnConnect("create room").subscribe(({ client, data: { user, room } }) => {
  roomService.createRoom({ user, room });
  // no single source of truth!!
  client.data.room = room;
  client.data.user = user;
  client.join(room);
  client.emit("room joined", { user, room });
});

listenOnConnect("join room").subscribe(({ client, data: { user, room } }) => {
  roomService.addUserToRoom({ user, room });
  // no single source of truth!!
  client.data.room = room;
  client.data.user = user;
  client.join(room);
  client.emit("room joined", { user, room });
});

listenOnConnect("chat message").subscribe(
  ({ io, client, data: { message } }) => {
    const { room, user } = client.data;
    io.to(room).emit("chat message", { message, user });
  }
);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
