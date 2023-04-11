import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { response } from "express";
import { timer, interval, fromEvent, Observable, noop } from "rxjs";
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

    
  }
}
