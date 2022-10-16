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
    super({ rooms: [] });
    RoomState._instance = this;
  }

  addRoom(name) {
    this.setState({ rooms: [...this.state.rooms, { name, messages: [] }] });
  }

  removeRoom(name) {
    this.setState({
      rooms: this.state.rooms.filter((room) => room.name !== name),
    });
  }

  rooms$ = this.select((state) => state.rooms);
}

