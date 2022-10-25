import { BehaviorSubject, distinctUntilChanged, map } from "rxjs";
const { stringify } = JSON;

class State {
  get state() {
    return this.state$.getValue();
  }

  constructor(value) {
    this.state$ = new BehaviorSubject(value);
  }

  setState(value) {
    this.state$.next({
      ...this.state,
      ...value,
    });
  }

  select(fn) {
    return this.state$.asObservable().pipe(
      map((state) => fn(state)),
      distinctUntilChanged((a, b) => stringify(a) == stringify(b))
    );
  }
}

export class RoomState extends State {
  constructor() {
    // Singleton
    if (RoomState._instance) {
      return RoomState._instance;
    }
    super({ rooms: {} });
    RoomState._instance = this;
  }

  createRoom({ room, user }) {
    // TODO: room exist
    this.setState({ rooms: { ...this.state.rooms, [room]: [user] } });
    return room
  }

  addUserToRoom({ room, user }) {
    const rooms = this.state.rooms;
    const users = [...rooms[room], user];

    this.setState({ rooms: { ...rooms, [room]: users } });
  }

  removeUserFromRoom({ room, user }) {
    const rooms = this.state.rooms;
    const users = [...rooms[room].filter((u) => u !== user)];

    if (users.length === 0) {
      delete rooms[room];
      this.setState({ rooms: { ...rooms } });
    } else {
      this.setState({ rooms: { ...rooms, [room]: users } });
    }
  }

  rooms$ = this.select((state) => state.rooms);
}
