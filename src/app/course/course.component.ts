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

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit, AfterViewInit {
  course$: Observable<any>;
  lessons$: Observable<any>;

  @ViewChild("searchInput", { static: true, read: ElementRef })
  input: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const courseId = this.route.snapshot.params["id"];

    this.course$ = createHttpObservable(`/api/courses/${courseId}`);
    this.lessons$ = createHttpObservable(
      `/api/lessons?courseId=${courseId}&pageSize=100`
    ).pipe(map((res) => res["payload"]));
  }

  ngAfterViewInit() {
    // implementing searh

    //defining the event stream
    fromEvent<any>(this.input.nativeElement, "keyup")
      .pipe(
        map((event) => event.target.value),
        debounceTime(400),
        // removes duplications
        distinctUntilChanged()
      )
      .subscribe(console.log);
  }
}
