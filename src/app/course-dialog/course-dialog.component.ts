import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { fromEvent } from "rxjs";
import {
  concatMap,
  distinctUntilChanged,
  exhaustMap,
  filter,
  mergeMap,
} from "rxjs/operators";
import { fromPromise } from "rxjs/internal-compatibility";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
})
export class CourseDialogComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  course: Course;

  @ViewChild("saveButton", { static: true, read: ElementRef })
  saveButton: ElementRef;

  @ViewChild("searchInput", { static: true }) searchInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }

  ngOnInit() {
    this.form.valueChanges
      .pipe(
        filter(() => this.form.valid),
        // concatMap vs mergeMap - concatMap will proced only after first save will be complete
        // and if order of observable values is important we should use with concatMap
        // if we need to perform our observables in parallel - mergeMap
        concatMap((changes) => this.saveCourse(changes))
      )
      .subscribe((changes) => {
        // const saveCourse$ = this.saveCourse(changes);
        // to have subscribe inside the subscribe is the antipattern
        // saveCourse$.subscribe();
      });
  }

  saveCourse(changes) {
    return fromPromise(
      fetch(`api/courses/${this.course.id}`, {
        method: "PUT",
        body: JSON.stringify(changes),
        headers: {
          "content-type": "application/json",
        },
      })
    );
  }

  ngAfterViewInit() {
    const saveOnClick$ = fromEvent(this.saveButton.nativeElement, "click").pipe(
      // exhaustMap will prevent from multiple clicking in a row
      exhaustMap(() => this.saveCourse(this.form.value))
    );

    saveOnClick$.subscribe(() => console.log("saved"));
  }

  close() {
    this.dialogRef.close();
  }

  save() {}
}
