import { of, fromEvent } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import  io  from "socket.io-client";

const URL = "http://localhost:3000";
const socket = io(URL, { autoConnect: false });

// Initialise Socket.IO and wrap in observable
const socket$ = of(socket.connect())

// Stream of connections
const connect$ = socket$
  .pipe(
    switchMap(socket =>
      fromEvent(socket, 'connect')
        .pipe(
          map(() => {
            console.log('socket connected')
            return socket
          })
        )
    )
  )

// On connection, listen for event
export const listenOnConnect = (event) => {
return connect$
  .pipe(
    switchMap(socket =>
      fromEvent(socket, event)
    )
  )
}

// On connection, emit data from observable
export const emitOnConnect = (observable$) => {
  return connect$
    .pipe(
      switchMap(socket =>
        observable$
          .pipe(
            map(data => ({ socket, data }))
          )
      )
    )
}
