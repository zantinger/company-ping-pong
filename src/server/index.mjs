import express from "express";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Server } from "socket.io";
import { of, fromEvent } from "rxjs";
import { map, switchMap, mergeMap, takeUntil } from "rxjs/operators";

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

connection$.subscribe(async({ io, client }) => {
  const x = await io.allSockets()
});


const users = []

listenOnConnect('roomConnection')
  .subscribe(({io, client, data }) => {    
    const user = {...data, id: client.id}
    users.push(user)

    client.join(user.room)
    client.to(user.room).emit("message", `Message to all except me`)
    io.in(user.room).emit('message', 'Message to all')

    io.in(user.room).emit('roomConnection', data)
  })

listenOnConnect('chatMessage')
  .subscribe(({io, client, data}) => {
    console.log(users)
    console.log(client.id)
    const user = users.find(user => user.id === client.id)

    io.in(user.room).emit('chatMessage', data)
  })


server.listen(3000, () => console.log("Listen on port 3000"));
