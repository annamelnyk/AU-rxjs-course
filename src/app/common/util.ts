import { Observable } from "rxjs";

// creating our own Observable
// this is just a definition of http stream
export function createHttpObservable(url: string) {
  return new Observable((observer) => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(url, { signal })
      .then((response) => response.json())
      .then((body) => {
        // console.log(body)
        observer.next(body);
        observer.complete();
      })
      .catch((err) => {
        observer.error(err);
      });

    // fetch cancellation (of http request)
    return () => controller.abort();
  });
}
