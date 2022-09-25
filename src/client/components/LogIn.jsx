import { useEffect } from "react";
import { Subject, BehaviorSubject, map, mergeMap, switchMap } from "rxjs";
// import { emitOnConnect, listenOnConnect } from "../socket";
import {
  useObservable,
  useSocketListener,
  useSocketEmiter,
} from "../utils.js";

const onCreateRoom = new Subject();
const userName$ = new BehaviorSubject("");
const roomName$ = new BehaviorSubject("");
const userAndRoom$ = userName$.pipe(
  mergeMap((userName) =>
    roomName$.pipe(map((roomName) => [userName, roomName]))
  )
);
const validUserAndRoom$ = userAndRoom$.pipe(
  map(([userName, roomName]) => !(!!userName && !!roomName))
);

const createRoom$ = onCreateRoom.pipe(
  switchMap(() =>
    userName$.pipe(
      mergeMap((userName) =>
        roomName$.pipe(map((roomName) => ({ roomName, userName })))
      )
    )
  )
);

const LogIn = () => {
  const isCreateRoomDisabled = useObservable(validUserAndRoom$, false);
  const rooms = useSocketListener("available rooms", []);

  useSocketEmiter(createRoom$, ({ socket, data }) =>
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
          <select id="selectRoom" defaultValue={"default"}>
            <option disabled value={"default"}>
              Choose a room
            </option>
            {rooms.map((room) => (
              <option>{room}</option>
            ))}
          </select>
          <button disabled={true}>Enter Room</button>
        </fieldset>
      </div>
    </form>
  );
};

export default LogIn;
