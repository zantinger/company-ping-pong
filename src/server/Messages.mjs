import { BehaviorSubject } from "rxjs";

export default class Messages {
  constructor() {
    this._messages$ = new BehaviorSubject([]);
  }

  add({ user, message }) {
    this._messages$.next([...this._messages$.value, { user, message }]);
  }

  listen(handler) {
    this._messages$.subscribe(handler);
  }
}
