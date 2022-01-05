import {
  BehaviorSubject,
  combineLatest,
  of,
  fromEvent,
  interval,
  Subject,
} from "rxjs";
import { map, switchMap, mergeMap, takeUntil } from "rxjs/operators";
// data for canvas 1000 / 600
// player1, player2, ball
// 10 250 980 250 500 300
//
const canvas = [1000, 600];
const paddle = [10, 100];

let player1 = {
  position: [10, canvas[1] / 2 - paddle[1] / 2],
  velocity: [0, 0],
  accel: [0, 0],
  name: "player1",
};

let player2 = {
  position: [canvas[0] - (paddle[0] + 10), canvas[1] / 2 - paddle[1] / 2],
  velocity: [0, 0],
  accel: [0, 0],
  name: "player2",
};
let ball = {
  position: [canvas[0] / 2, canvas[1] / 2],
  velocity: [3, 3],
  accel: [0, 0],
  name: "ball",
};

let gameObjects = [player1, player2, ball];

const update = (p) => {
  let [[px, py], [vx, vy], [ax, ay]] = [p.position, p.velocity, p.accel];

  if (p.name === 'player1') {
  console.log(`vor update. positiosn: ${p.position}, velocity: ${p.velocity}, accel: ${p.accel}`)
  }

  vx = vx + ax;
  vy = vy + ay;

  let position = [px + vx, py + vy];
  let velocity = [vx, vy];
  let accel = [0, 0];

  if (p.name === 'player1') {
  console.log(`nach update. positiosn: ${position}, velocity: ${velocity}, accel: ${accel}`)
  }

  return { ...p, position, velocity, accel };
};

const Position = ({ position, name }) => ({ position, name });

const updateGameObjects = () => {
  gameObjects = gameObjects
    .map((obj) => borderCollision(obj))
    .map((obj) => update(obj));
  // .map(obj => Position(obj))

  positionSubjects$.next(gameObjects.map(Position));
};

const borderCollision = (obj) => {
  if (obj.name === "ball") {
    let { position, velocity } = obj;
    // check if ball hits top or bottom wall
    if (position[0] >= canvas[0] || position[0] <= 0) velocity[0] *= -1;
    if (position[1] >= canvas[1] || position[1] <= 0) velocity[1] *= -1;
    return { ...obj, velocity };
  } 
    return obj;
};

const keyCodeHandler = ({ keyCode }) => {
  gameObjects = gameObjects.map((obj) => {
    if (keyCode === 38) {
      obj.position = [obj.position[0], obj.position[1] + 8];
      return obj
    } else if (keyCode === 40) {
      obj.position = [obj.position[0], obj.position[1] - 8];
      return obj
    } else {

      return obj
    }
  });
  positionSubjects$.next(gameObjects.map(Position));
};

const player1Subject = new BehaviorSubject(Position(player1));
const player2Subject = new BehaviorSubject(Position(player2));
const ballSubject = new BehaviorSubject(Position(ball));

const positionSubjects$ = new BehaviorSubject([
  Position(player1),
  Position(player2),
  Position(ball),
]);
// combineLatest([player1Subject, player2Subject, ballSubject])

export { positionSubjects$, keyCodeHandler };
