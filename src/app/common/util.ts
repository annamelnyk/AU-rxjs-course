import { Observable } from "rxjs";

// creating our own Observable
// this is just a definition of http stream
export function createHttpObservable(url: string) {
  return new Observable((observer) => {
    fetch(url)
      .then((response) => response.json())
      .then((body) => {
        // console.log(body)
        observer.next(body);
        observer.complete();
      })
      .catch((err) => {
        observer.error(err);
      });
  });
}
