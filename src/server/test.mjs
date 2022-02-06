import {BehaviorSubject, merge, combineLatest, Subject, from, of, concat, fromEvent, interval } from "rxjs";
import {scan,  reduce,pairwise, map, switchMap, mergeMap, takeUntil } from "rxjs/operators";

let foo = {a: 0, b: 0}
let a1 = new BehaviorSubject({type: "ADD", payload: 1})
let a2 = of({a: 1})

let add = num => state => ({
  ...state,
  a: state.a + num,
})

let update = fn => state => {
  state = fn(state)
  // console.log('state ',state)
  // console.log('x ', x)

  return {
  ...state,
  a: 0,
  b: state.b + state.a,
}
} 

let route = {ADD: add}

let a1$ = a1.pipe(
  map(obj => route[obj.type](obj.payload)),
  map(update),
  scan((acc, fn) => fn(acc), foo),
)


combineLatest([a1$, a2]).subscribe(console.log)


a1.next({type: "ADD", payload: 1})
a1.next({type: "ADD", payload: 5})


