import {
  of,
  map,
  scan,
  BehaviorSubject,
  combineLatest,
  distinctUntilKeyChanged,
} from "rxjs";
import { ballCollision, getRandomInt } from "./utils.mjs";

const AREA_WIDTH = 1000;
const AREA_HEIGHT = 600;

class Area {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
}

class Player {
  constructor(x) {
    this.x = x;
    this.y = 0;
    this.color = "#FFF";
    this.width = 10;
    this.height = 100;
  }
}

class Ball {
  constructor() {
    this.x = AREA_WIDTH / 2;
    this.y = AREA_HEIGHT / 2;
    this.color = "#FFF";
    this.radius = 7;
    this.accelX = 0;
    this.accelY = 0;
    this.directionX = Math.round(Math.random()) == 1 ? 1 : -1;
    this.directionY = Math.round(Math.random()) == 1 ? 1 : -1;
  }
}

class Score {
  constructor({ player1, player2 }) {
    this.player1 = player1;
    this.player2 = player2;
    this.font = "30px Arial";
    this.color = "#FFF";
  }
}
export default class GameObjects {
  constructor() {
    this.veloPlayer1$ = new BehaviorSubject({ x: 0, y: 0 });
    this.scorePlayer1$ = new BehaviorSubject(0).pipe(scan((acc, _) => acc + 1));
    this.veloPlayer2$ = new BehaviorSubject({ x: 0, y: 0 });
    this.scorePlayer2$ = new BehaviorSubject(0).pipe(scan((acc, _) => acc + 1));
    this.veloBall$ = new BehaviorSubject({ x: 5, y: 5 });
    this.area = of(new Area(AREA_WIDTH, AREA_HEIGHT));
  }

  get player1$() {
    return this.veloPlayer1$.pipe(
      scan(
        (acc, n) => ({ ...acc, x: acc.x + n.x, y: acc.y + n.y }),
        new Player(10)
      )
    );
  }

  get player2$() {
    return this.veloPlayer2$.pipe(
      scan(
        (acc, n) => ({ ...acc, x: acc.x + n.x, y: acc.y + n.y }),
        new Player(AREA_WIDTH - 20)
      )
    );
  }

  get ball$() {
    return combineLatest({
      veloBall: this.veloBall$,
      player1: this.player1$,
      player2: this.player2$,
      area: this.area,
    }).pipe(
      distinctUntilKeyChanged("veloBall"),
      scan((acc, { veloBall, player1, player2, area }) => {
        const nearestPlayer = acc.x < area.width / 2 ? player1 : player2;

        // if ball hits paddle
        if (ballCollision(nearestPlayer, acc)) {
          acc.directionX = -acc.directionX;
          acc.accelX = getRandomInt(0, 5);
          acc.accelY = getRandomInt(0, 2);
        }

        // if ball hit bottom or top, we swap directionY
        if (acc.y - acc.radius < 0 || acc.y + acc.radius > area.height) {
          acc.directionY = -acc.directionY;
        }

        // if player2 scores
        if (acc.x - acc.radius < 0) {
          this.scorePlayer2$.next();
          return new Ball();
          // if player1 scores
        } else if (acc.x + acc.radius > area.width) {
          this.scorePlayer1$.next();
          return new Ball();
        } else {
          return {
            ...acc,
            x: (acc.accelX + veloBall.x) * acc.directionX + acc.x,
            y: (acc.accelY + veloBall.y) * acc.directionY + acc.y,
          };
        }
      }, new Ball())
    );
  }

  get score$() {
    return combineLatest({
      player1: this.scorePlayer1$,
      player2: this.scorePlayer2$,
    }).pipe(map((score) => new Score(score)));
  }
}
