import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { response } from "express";
import {
  timer,
  interval,
  fromEvent,
  Observable,
  noop,
  of,
  concat,
  merge,
} from "rxjs";
import { map } from "rxjs/operators";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // js callback hell
    // document.addEventListener("click", (e) => {
    //   console.log(e);
    //   setTimeout(() => {
    //     console.log("finished...");
    //     let counter = 0;
    //     setInterval(() => {
    //       console.log(counter);
    //       counter++;
    //     }, 1000);
    //   }, 3000);
    // });
    //rxjs streams
    //   const interval$ = timer(3000, 1000);
    //   const sub = interval$.subscribe((val) => console.log("stream 1 => ", val));
    //   setTimeout(() => sub.unsubscribe(), 5000);
    //   const click$ = fromEvent(document, "click");
    //   click$.subscribe(
    //     console.log,
    //     (err) => console.log("Error: ", err),
    //     () => console.log("completed")
    //   );

    // rxjs-observable-concatenation
    // of operator defines any kind of observables
    // const source1$ = of(1, 2, 3);
    // const source2$ = of(4, 5, 6);
    // const source3$ = of(7, 8, 9);

    // const result$ = concat(source1$, source2$, source3$);
    // result$.subscribe(x => console.log(x))

    // merge operator
    // merge is ideal performing for long operations in parallel and
    // getting the result of each operation combining them
    // (for http requests in parellel)
    // const interval1$ = interval(1000);
    // const interval2$ = interval1$.pipe(map((val) => val * 10));

    // const result$ = merge(interval1$, interval2$);

    // result$.subscribe(console.log);

    // Unsubscription
    // const interval$ = interval(1000);
    // const sub = interval$.subscribe(console.log);

    // setTimeout(() => sub.unsubscribe(),5000);

    // http cancellation
    const http$ = createHttpObservable("/api/courses");
    const sub = http$.subscribe(console.log);

    setTimeout(() => sub.unsubscribe(), 0);
  }
}
