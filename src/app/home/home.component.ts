import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, Observable, of, timer, noop } from "rxjs";
import {
  catchError,
  delayWhen,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  // imperative approach
  // beginnerCourses: Course[];
  // advancedCourses: Course[];

  // Reactive Design
  // data itsels is not available for direct mutation here
  // we only have here definition of streams of data
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;
  constructor() {}

  ngOnInit() {
    const http$ = createHttpObservable("/api/courses");

    // this is blueprint of retrieving values (not an api call)
    const courses$: Observable<Course[]> = http$.pipe(
      // tap() operator is used to produce side effects in observable chain
      // (if we need update smth outside of observable chain or logging statement, etc)
      tap(() => console.log("Http request")),
      map((response) => Object.values(response["payload"])),
      // shareReplay handles that this http response will pass to each subscription
      shareReplay<Course[]>()
    );

    // each subscribe - is api call (each subscribe creates completely new stream)
    this.beginnerCourses$ = courses$.pipe(
      map((courses) => {
        return courses.filter(
          (course: Course) => course.category === "BEGINNER"
        );
      })
    );

    this.advancedCourses$ = courses$.pipe(
      map((courses) => {
        return courses.filter(
          (course: Course) => course.category === "ADVANCED"
        );
      })
    );

    // courses$.subscribe(
    // such approach increased code reading complexity
    // this is an imperative approach, preferable to use instaed Reactive Design
    //   (courses: Course[]) => {
    //     this.beginnerCourses = courses.filter(
    //       (course: Course) => course.category === "BEGINNER"
    //     );
    //     this.advancedCourses = courses.filter(
    //       (course: Course) => course.category === "ADVANCED"
    //     );
    //   },
    //  noop, // noop === no operations
    //  () => console.log("completed")
    //);
  }
}
