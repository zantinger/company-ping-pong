import { map } from "rxjs/operators";
import { connection$, listenOnConnect } from "./connection.mjs";
import { httpServer } from './server.mjs'

const availableRooms$ = connection$.pipe(
  map(({ io }) => {
    const rooms = Array.from(io.sockets.adapter.rooms)
      .filter((room) => !room[1].has(room[0]))
      .map((x) => x[0]);
    return { rooms, io };
  })
);

availableRooms$.subscribe(({ rooms, io }) => {
  console.log("data ", rooms);
  io.emit("available rooms", rooms);
});

listenOnConnect("create room").subscribe(({ client, data }) => {
  client.join(data.roomName);
  client.emit("room joined", data);
});

listenOnConnect("chat message").subscribe(({ client, data }) => {
  console.log("pm ", data);
  client.emit("foo", [{ author: "Mark", msg: "hello" }]);
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
