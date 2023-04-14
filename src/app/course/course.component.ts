import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay,
} from "rxjs/operators";
import { merge, fromEvent, Observable, concat, pipe } from "rxjs";
import { Lesson } from "../model/lesson";
import { createHttpObservable } from "../common/util";
import { FromEventTarget } from "rxjs/internal/observable/fromEvent";

import { debug, RxJsLoggingLevel, setRxJsLoggingLevel } from "../common/debug";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit, AfterViewInit {
  course$: Observable<any>;
  lessons$: Observable<any>;
  courseId: string;

  @ViewChild("searchInput", { static: true, read: ElementRef })
  input: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.params["id"];
    this.course$ = createHttpObservable(`/api/courses/${this.courseId}`).pipe(
      debug(RxJsLoggingLevel.INFO, "course ")
    );

    setRxJsLoggingLevel(RxJsLoggingLevel.DEBUG)
    this.lessons$ = this.loadLessons();
  }

  ngAfterViewInit() {
    // implementing searh

    //defining the event stream
    this.lessons$ = fromEvent<any>(this.input.nativeElement, "keyup").pipe(
      map((event) => event.target.value),

      // with startWith operator we initialize the stream with given initial value
      startWith(""),
      debug(RxJsLoggingLevel.TRACE, "search "),
      // also instead of debounce can be used throttle/throttleTime operators
      debounceTime(400),
      // removes duplications
      distinctUntilChanged(),
      // concat map doesn suit here because we want to cancel ongoing request immidiately and make new one,
      // but with concat all requets will be occured one by another
      //concatMap(search => this.loadLessons(search))

      switchMap((search) => this.loadLessons(search)),
      debug(RxJsLoggingLevel.DEBUG, "lessons ")
    );
  }

  loadLessons(search = ""): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(map((res) => res["payload"]));
  }
}
