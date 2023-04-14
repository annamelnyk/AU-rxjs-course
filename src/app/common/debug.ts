import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export enum RxJsLoggingLevel {
  TRACE,
  DEBUG,
  INFO,
  ERROR,
}

let rxjsLoggingLevel = RxJsLoggingLevel.INFO;

// with this helper we set to RxJsLoggingLevel.[VALUE] the level value
// to print it to the console 
export function setRxJsLoggingLevel(level: RxJsLoggingLevel) {
  rxjsLoggingLevel = level;
}

export const debug =
  (level: number, message: string) => (source: Observable<any>) => {
    return source.pipe(
      tap((val) => {
        if (level >= rxjsLoggingLevel) {
          console.log(`${message}: ${JSON.stringify(val)}`);
        }
      })
    );
  };
