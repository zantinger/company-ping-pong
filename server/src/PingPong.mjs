import { interval, withLatestFrom, combineLatest, map } from "rxjs";
import GameObjects from "./GameObjects.mjs";

export default class PingPong extends GameObjects {
  constructor() {
    super();
    this.loop$ = interval(20);
    this._gameSubscriber = undefined;
    this.movement = {
      ArrowUp: { x: 0, y: -5 },
      ArrowDown: { x: 0, y: 5 },
    };
  }

  _combinedData() {
    return {
      player1: this.player1$,
      player2: this.player2$,
      ball: this.ball$,
      area: this.area,
      score: this.score$,
    };
  }

  _gameData$() {
    return this.loop$.pipe(
      withLatestFrom(combineLatest(this._combinedData())),
      map(([_, game]) => game)
    );
  }

  updateVeloPlayer1(direction) {
    this.veloPlayer1$.next(this.movement[direction]);
  }

  updateVeloPlayer2(direction) {
    this.veloPlayer2$.next(this.movement[direction]);
  }

  run(handler) {
    if (this._gameSubscriber !== undefined) return;
    this._gameSubscriber = this._gameData$().subscribe(handler);
  }

  stop() {
    this._gameSubscriber.unsubscribe();
  }
}
