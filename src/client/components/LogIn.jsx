import { Subject, BehaviorSubject, map, mergeMap, switchMap } from "rxjs";
import { useObservable, useSocketListener, useSocketEmiter } from "../utils.js";
import { useEffect } from "react";

// Subject's for click event
const onCreateRoom = new Subject();
const onJoinRoom$ = new Subject();

// Subject's for user input
const userName$ = new BehaviorSubject("");
const roomName$ = new BehaviorSubject("");
const onChangeOption$ = new BehaviorSubject("");

// Merge username and room name
const userAndRoom$ = userName$.pipe(
  mergeMap((userName) =>
    roomName$.pipe(map((roomName) => [userName, roomName]))
  )
);

const validUserAndRoom$ = userAndRoom$.pipe(
  map(([userName, roomName]) => !(!!userName && !!roomName))
);

// On btn click, switch stream to username and room name
const createRoom$ = onCreateRoom.pipe(
  switchMap(() =>
    userName$.pipe(
      mergeMap((userName) =>
        roomName$.pipe(map((roomName) => ({ roomName, userName })))
      )
    )
  )
);

const selectRoom$ = onJoinRoom$.pipe(
  switchMap(() =>
    userName$.pipe(
      mergeMap((userName) =>
        onChangeOption$.pipe(map((roomName) => ({ roomName, userName })))
      )
    )
  )
);

const LogIn = () => {
  // Only enable btn when we have name for user and room
  const isCreateRoomDisabled = useObservable(validUserAndRoom$, false);
  // const isJoinRoomDisabled = useObservable(validUserAndRoom$, false);

  // If there are already rooms open
  const rooms = useSocketListener("available rooms", []);

  // Emit data when username and room name are defined
  useSocketEmiter(createRoom$, ({ socket, data }) =>
    socket.emit("create room", data)
  );

  useSocketEmiter(selectRoom$, ({ socket, data }) =>
    socket.emit("create room", data)
  );

  return (
    <form>
      <div className="row">
        <fieldset className="column column-50 column-offset-25">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            onInput={(e) => userName$.next(e.target.value)}
          />
        </fieldset>
      </div>
      <div className="row">
        <fieldset className="column">
          <label htmlFor="roomName">Room Name</label>
          <input
            id="roomName"
            type="text"
            onInput={(e) => roomName$.next(e.target.value)}
          />
          <button
            type="button"
            disabled={isCreateRoomDisabled}
            onClick={(e) => onCreateRoom.next(e)}
          >
            Create Room
          </button>
        </fieldset>
        <fieldset className="column">
          <label htmlFor="selectRoom">Rooms</label>
          <select
            id="selectRoom"
            onChange={(e) => onChangeOption$.next(e.target.value)}
            defaultValue={"default"}
          >
            <option disabled value={"default"}>
              Choose a room
            </option>
            {rooms.map((room) => (
              <option key={room}>{room}</option>
            ))}
          </select>
          <button
            type="button"
            disabled={false}
            onClick={(e) => onJoinRoom$.next(e)}
          >
            Enter Room
          </button>
        </fieldset>
      </div>
    </form>
  );
};

export default LogIn;
