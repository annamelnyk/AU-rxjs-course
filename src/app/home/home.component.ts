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
  beginnerCourses: Course[];
  advancedCourses: Course[];
  constructor() {}

  ngOnInit() {
    const http$ = createHttpObservable("/api/courses");

    const courses$ = http$.pipe(
      map((response) => Object.values(response["payload"]))
    );

    courses$.subscribe(
      // such approach increased code reading complexity
      // this is an imperative approach, preferable to use instaed Reactive Design
      (courses: Course[]) => {
        this.beginnerCourses = courses.filter(
          (course: Course) => course.category === "BEGINNER"
        );
        this.advancedCourses = courses.filter(
          (course: Course) => course.category === "ADVANCED"
        );
      },
      noop, // noop === no operations
      () => console.log("completed")
    );
  }
}
