import { map } from "rxjs/operators";
import { connection$, listenOnConnect } from "./connection.mjs";
import { httpServer } from './server.mjs'

const getRoomsFromAdapter = io => 
    Array.from(io.sockets.adapter.rooms)
      .filter((room) => !room[1].has(room[0]))
      .map((x) => x[0]);

const availableRooms$ = connection$.pipe(
  map(({ io }) => {
    const rooms = getRoomsFromAdapter(io)
    return { rooms, io };
  })
);

availableRooms$.subscribe(({ rooms, io }) => {
  io.emit("available rooms", rooms);
});

listenOnConnect("create room").subscribe(({ io, client, data }) => {
  client.join(data.roomName);
  client.emit("room joined", data);
  let rooms = new Set(getRoomsFromAdapter(io))
  rooms = Array.from(rooms.add(data.roomName))
  // TODO send only to other
  io.emit("available rooms", rooms);
});

listenOnConnect("chat message").subscribe(({ client, data }) => {
  client.emit("foo", [{ author: "Mark", msg: "hello" }]);
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
