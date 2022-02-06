import {
  BehaviorSubject,
  combineLatest,
  of,
  fromEvent,
  interval,
  Subject,
} from "rxjs";
import { scan, tap, map, switchMap, mergeMap, takeUntil } from "rxjs/operators";
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

let players = {player1}

let ball = {
  position: [canvas[0] / 2, canvas[1] / 2],
  velocity: [3, 3],
  accel: [0, 0],
  name: "ball",
};

const update = (fn) => state => {
  let p = fn(state)
  // console.log(p)
  let [[px, py], [vx, vy], [ax, ay]] = [p.position, p.velocity, p.accel];

  vx = vx + ax;
  vy = vy + ay;

  let position = [px + vx, py + vy];
  let velocity = [vx, vy];
  let accel = [0, 0];

  return { ...p, position, velocity, accel, name: p.name };
};

const Position = ({ position, name }) => ({ position, name });

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

const keyUp = (keyCode) => player => {
  const [x,y] = player.accel
  const value = (keyCode === 38) ? -8 : (keyCode === 40) ? 8 : 0
  return {...player, accel: [x + 0, y + value]}
}
const keyDown = (keyCode) => player => {
  console.log("xxxxxxxxxxx")
  const [x,y] = player.accel
  const value = (keyCode === 38) ? 8 : (keyCode === 40) ? -8 : 0
  return {...player, accel: [x + 0, y + value]}
}
const start = x => players => ({...players})

const route =  {START: start, KEY_UP: keyUp, KEY_DOWN: keyDown}
const playerRoute = {PLAYER1: player1, PALAYER2: player2}

const player1Subject = new BehaviorSubject({type: "START", payload: null});
// const player2Subject = new BehaviorSubject(Position(player2));
const ballSubject = new BehaviorSubject({type: null});

let player1$ = player1Subject.pipe(
  map((obj) => route[obj.type](obj.payload)),
  map(obj => update(obj)),
  scan((acc, fn) => fn(acc), player1)
)

let i = interval(1000)


let ball$ = ballSubject

i.subscribe(x => ballSubject.next())

let gameData = combineLatest([player1$, ball$])


export { gameData,  player1Subject };
