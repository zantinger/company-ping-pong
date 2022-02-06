import express from "express";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Server } from "socket.io";
import { of, merge, fromEvent } from "rxjs";
import { map, switchMap, mergeMap, takeUntil } from "rxjs/operators";
import {gameData ,player1Subject} from "./gameData.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io$ = of(new Server(server));

const Fn = (g) => ({
  map: (f) => Fn((x) => f(g(x))),
  chain: (f) => Fn((x) => f(g(x)).run(x)),
  concat: (other) => Fn((x) => g(x).concat(other.run(x))),
  run: g,
});
Fn.ask = Fn((x) => x);
Fn.of = (x) => Fn(() => x);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const connection$ = io$.pipe(
  switchMap((io) =>
    fromEvent(io, "connection").pipe(map((client) => ({ io, client })))
  )
);

const disconnect$ = connection$.pipe(
  mergeMap(({ client }) =>
    fromEvent(client, "disconnect").pipe(map(() => client))
  )
);

// On connection, listen for event
function listenOnConnect(event) {
  return connection$.pipe(
    mergeMap(({ io, client }) =>
      fromEvent(client, event).pipe(
        takeUntil(fromEvent(client, "disconnect")),
        map((data) => ({ io, client, data }))
      )
    )
  );
}

connection$.subscribe(async ({ io, client }) => {
  const x = await io.allSockets();
});

const users = [];

// Room Connection
// When enter in room, user is registered
// TODO: 
// better handling for identify users
// Can we avoid global user?
// For every game there should be a unique room
// Limit amount of users
listenOnConnect("roomConnection").subscribe(({ io, client, data }) => {
  const player = (users.length === 0) ? "PLAYER1" : "PLAYER2"
  const user = { ...data, id: client.id, player };
  users.push(user);
  client.emit("develop", `user: ${JSON.stringify(user)}`);


  // client.join(user.room);
  // client.to(user.room).emit("message", `Message to all except me`);
  // io.in(user.room).emit("message", "Message to all");

  // io.in(user.room).emit("roomConnection", data);
});

listenOnConnect("chatMessage").subscribe(({ io, client, data }) => {
  const user = users.find((user) => user.id === client.id);

  io.in(user.room).emit("chatMessage", data);
});

listenOnConnect("playerData").subscribe(({ io, client, data }) => {
  if (users.length === 0) return;

  const [keyCode, direction] = data;
  const user = users.find((user) => user.id === client.id);

  const player = users[0].id === client.id ? "player1" : "player2";

  io.in(user.room).emit("playerData", { player, keyCode, direction });
});

const route = {PLAYER1: player1Subject}

  // client id muss mit uebergeben werden
listenOnConnect("keyPressed").subscribe(({ io, client, data }) => {
  // client.emit("develop", `users: ${JSON.stringify(users.length)}`);
  const user = users.filter((user) => user.id === client.id)
  console.log('user: ', user)
  user.map(({player}) => route[player].next(data))
});

connection$.subscribe(({io, client}) => {
  gameData.subscribe(x => {

  client.emit("gameData", x[0].position)
  })
})



server.listen(3000, () => console.log("Listen on port 3000"));
