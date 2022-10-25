import { Subject, BehaviorSubject, map, mergeMap, switchMap } from "rxjs";
import { useObservable, useSocketListener, useSocketEmiter } from "../utils.js";

// Subject's for click event
const onCreateRoom$ = new Subject();
const onJoinRoom$ = new Subject();

// Subject's for user input
const user$ = new BehaviorSubject("");
const room$ = new BehaviorSubject("");
const onChangeOption$ = new BehaviorSubject("");

// Generic fn for switching streams
const switchUserAndRoom = (source$) =>
  switchMap(() =>
    user$.pipe(
      mergeMap((user) => source$.pipe(map((room) => ({ user, room }))))
    )
  );

// Click streams for create and join room
const createRoom$ = onCreateRoom$.pipe(switchUserAndRoom(room$));
const joinRoom$ = onJoinRoom$.pipe(switchUserAndRoom(onChangeOption$));

const LogIn = () => {
  // Get already created rooms
  const rooms = useSocketListener("available rooms", {});
  const room = useObservable(room$, "");
  const user = useObservable(user$, "");
  const doRoomAlreadyExists = rooms[room] !== undefined;
  const optSelected = useObservable(onChangeOption$, null);

  // Only enable btn when conditions are fulfilled
  const isBtnCreateDisabled = !(
    user.length > 2 &&
    room.length > 2 &&
    !doRoomAlreadyExists
  );
  const isBtnJoinDisabled = !(
    user.length > 2 && rooms[optSelected] !== undefined
  );

  // Emit user- and room names for creating room.
  useSocketEmiter(createRoom$, ({ socket, data }) =>
    socket.emit("create room", data)
  );

  // Emit user- and room names for joining room.
  useSocketEmiter(joinRoom$, ({ socket, data }) =>
    socket.emit("join room", data)
  );

  return (
    <form>
      <div className="row">
        <fieldset className="column column-50 column-offset-25">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            onInput={(e) => user$.next(e.target.value)}
          />
        </fieldset>
      </div>
      <div className="row">
        <fieldset className="column">
          <label htmlFor="room">Room Name</label>
          <input
            id="room"
            type="text"
            className={doRoomAlreadyExists ? "error" : ""}
            onInput={(e) => room$.next(e.target.value)}
          />
          {doRoomAlreadyExists && (
            <div className="error-text">Name already exists</div>
          )}
          <button
            type="button"
            disabled={isBtnCreateDisabled}
            onClick={(e) => onCreateRoom$.next(e)}
          >
            Create Room
          </button>
        </fieldset>
        <fieldset className="column">
          <label htmlFor="joinRoom">Rooms</label>
          <select
            id="joinRoom"
            onChange={(e) => onChangeOption$.next(e.target.value)}
            defaultValue={"default"}
          >
            <option disabled value={"default"}>
              Choose a room
            </option>
            {Object.entries(rooms).map(([name, _]) => (
              <option key={name}>{name}</option>
            ))}
          </select>
          <button
            type="button"
            disabled={isBtnJoinDisabled}
            onClick={(e) => onJoinRoom$.next(e)}
          >
            Join Room
          </button>
        </fieldset>
      </div>
    </form>
  );
};

export default LogIn;
