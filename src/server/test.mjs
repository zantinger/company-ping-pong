import {BehaviorSubject, merge, combineLatest, Subject, from, of, concat, fromEvent, interval } from "rxjs";
import {  reduce,pairwise, map, switchMap, mergeMap, takeUntil } from "rxjs/operators";

let foo = {a: 0, b: 0}
let a1 = new BehaviorSubject(foo).pipe(pairwise())
let a2 = of({a: 1})

let obs ={
  player1: new BehaviorSubject(foo).pipe(pairwise()),
  player2: new BehaviorSubject({}),
}

// combineLatest([a1, a2]).subscribe()
combineLatest(obs).subscribe(console.log)


setTimeout(() => {
  obs.player1.next({ a: 1 })
  obs.player1.next({ b: 2 })
  // obs.player1.next({a: 1})
}, 1000)
