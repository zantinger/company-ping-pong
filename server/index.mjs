import {
  listenOnConnect,
  listenOnDisconnect$,
  connection$,
} from "./connection.mjs";
import { httpServer } from "./server.mjs";
import Messages from "./Messages.mjs";
import PingPong from "./PingPong.mjs";

// simple solution to handle rooms
const rooms = new Map();

// TODO: client data should be saved in cookie

function* PlayerNameGen() {
  yield "player1";
  yield "player2";
}

listenOnConnect("create room").subscribe(({ io, client, data }) => {
  const { user, room } = data;

  rooms.set(room, {
    pingPong: new PingPong(),
    messages: new Messages(),
    nameGen: PlayerNameGen(),
  });

  const roomHandler = rooms.get(room);

  roomHandler.messages.listen((messages) =>
    io.to(room).emit("chat messages", messages)
  );

  client.data.room = room;
  client.data.user = user;
  client.data.player = roomHandler.nameGen.next().value;
  client.join(room);
  client.emit("room joined", { user, room });
  io.emit("available rooms", { rooms: Array.from(rooms.keys()) });
});

listenOnConnect("select room").subscribe(({ io, client, data }) => {
  const { user, room } = data;
  const roomHandler = rooms.get(room);
  const nameGen = roomHandler.nameGen.next()

  if (nameGen.done) {
    // TODO
  } else {
    roomHandler.messages.listen((messages) =>
      io.to(room).emit("chat messages", messages)
    );

    client.data.room = room;
    client.data.user = user;
    client.data.player = nameGen.value;
    client.join(room);
    client.emit("room joined", { user, room });
  }
});

listenOnConnect("chat messages").subscribe(({ client, data }) => {
  const { user, room } = client.data;
  const { message } = data;

  rooms.get(room).messages.add({ user, message });
});

listenOnConnect("key pressed").subscribe(({ io, client, data }) => {
  const { room, player } = client.data;
  const { code } = data;

  if (room) {
    const pingPong = rooms.get(room).pingPong;

    switch (code) {
      case "Enter": {
        pingPong.run((gameObjects) =>
          io.to(room).emit("game data", gameObjects)
        );
        pingPong.loop$.subscribe(() => pingPong.veloBall$.next({ x: 4, y: 2 }));
        break;
      }
      case "Escape": {
        pingPong.stop();
        break;
      }
      case "ArrowUp": {
        player == "player1"
          ? pingPong.updateVeloPlayer1(code)
          : pingPong.updateVeloPlayer2(code);
      }
      case "ArrowDown": {
        player == "player1"
          ? pingPong.updateVeloPlayer1(code)
          : pingPong.updateVeloPlayer2(code);
      }
    }
  }
});

// TODO: cleanup room
listenOnDisconnect$.subscribe(({ io, client }) => {
  const { room } = client.data;
  // TODO: stop game
  console.log("listenOnDisconnect ", client.data);
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
