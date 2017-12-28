/**
 * Copyright 2017 - Author gauravm.git@gmail.com
 */

import * as Rx from 'rxjs';

const log = console.log;

function getPromise<T>(resolveAfter: number, ...args: any[]): Promise<T> {

  return new Promise((res: any) => setTimeout(res, resolveAfter, ...args));

}

export default class {

  private count = 0;
  private readonly testSubject: Rx.BehaviorSubject<number>;
  private currentO: Rx.Observable<any>;
  private queue: Array<Rx.Observable<any>> = [];

  public constructor() {

    this.testSubject = new Rx.BehaviorSubject<number>(0);

  }

  public testA(): {
    next: () => void,
    observable: Rx.Observable<number>
  } {

    log('Test-A');

    const o = this.testSubject.map((val: number) => {
      log(val);

      return val;
    });

    return {
      next: () => this.testSubject.next(++this.count),
      observable: o
    };

  }

  public testB<T>(data: T): Rx.Observable<T> {

    this.queue.push(this.getObservable<T>(data));

    const a = new Rx.BehaviorSubject<any>(() => this.getObservable<T>(data));
    a.subscribe((d) => d().subscribe((e: any) => log(e)));

    return this.processQueue();
  }

  public getObservable<T>(data: T): Rx.Observable<T> {

    return Rx.Observable.of(data);

  }

  private processQueue(): Rx.Observable<any> {

    const c = this.queue.shift() as Rx.Observable<any>;

    return c;
  }

}

/**
 * Provides a way to execute the same async task in a loop for n-times one after another(not parallel).
 * Note 1: Be careful when calling this function with large number of repetition, as
 * this function could result in classic 'JavaScript heap out of memory'.
 *
 * Note 2: You can provide extra arguments to this function that will be passed to the provided
 * async task. If the first argument of the variable arguments list is a function and its name
 * ends with '(methodName)loopAsync' i.e. methodName followed by loopAsync (case-insensitive) then,
 * it will be called in each iteration by the loopAsync method internally by passing in the
 * current iteration and the arguments to '(methodName)loopAsync' function in order to fetch the mutable
 * array(see note 2.1) and that will be
 * concatenated with the original arguments, spread and passed to the asyncTask function.
 *
 * Note: 2.1: '(methodName)loopAsync' must return an array containing the arguments needed to be passed to
 * the asyncTask function.
 *
 * For e.g: loopAsync({}, [], a_asyncTask, { times: 2 }, ...args)
 *            .then(...)
 *            .then(...)
 *             ....
 *             .catch(...)
 *
 * @param {*} thisArg The context in which the provided async task should be executed.
 * @param {Array.<any>} asyncTaskResultArray The array to be used to push the result of asyncTask. If
 * any other value is provided, the loopAsync method will create a new one.
 * @param {Function} asyncTask The function that will be called asynchronously.
 * @param {Object} option The number of iteration or a function that
 * returns Boolean true to continue the iteration or Boolean false to stop the iteration.
 * @param {Number=} option.times The number of times the asyncTask should be executed.
 * @param {Function=} option.iterateUntil A function which returns boolean value, if provided
 * times parameter will be ignored.
 * If function option.iterateUntil returns true then next iteration will be invoked else execution will
 * be halted.
 *
 * @return {Promise.<Array, WebError>} Resolves the Promise with an Array(array of resolved values) as the value.
 * Rejects the Promise with a WebError.
 */
export function loopAsync(thisArg: object, asyncTaskResultArray: any[],
  asyncTask: () => Promise<any>,
  option: {
    iterateUntilFn: (t: number) => boolean,
    currentIteration: number,
    times: number,
    started: boolean
  } /* [arguments] */) {

  if (typeof thisArg === 'undefined') {
    throw new Error('utils#loopAsync() invalid thisArg provided.');
  }
  if (typeof asyncTaskResultArray === 'undefined') {
    throw new Error('utils#loopAsync() invalid asyncTaskResultArray provided.');
  }
  if (typeof asyncTask !== 'function') {
    throw new Error('utils#loopAsync() invalid asyncTask function provided.');
  }
  if (typeof option !== 'object') {
    throw new Error('utils#loopAsync() invalid option provided.');
  }

  let asyncTaskArgArray: any[] = [];
  let argumentFunction: (t: number, a: any[]) => any[];
  let asyncTaskArgsLength: number;
  const iterateUntilFn = option.iterateUntilFn;

  if (iterateUntilFn) {
    if (typeof iterateUntilFn !== 'function') {
      throw new Error('utils#loopAsync() invalid option.iterateUntil function provided.');
    }

    option.currentIteration = option.currentIteration || 1;
  } else {
    if (typeof option.times !== 'number') {
      throw new Error('utils#loopAsync() invalid option.times function provided.');
    }

    // Initialize the iteration information
    option.times = (option.times < 1) ? 1 : option.times;
    option.currentIteration = (typeof option.started === 'undefined') ? 0 : option.currentIteration;
    option.started = true;
  }
  asyncTaskResultArray = (Array.isArray(asyncTaskResultArray) ? asyncTaskResultArray : []);

  if (arguments.length > 4) {
    // Get the arguments object and convert into array, if any extra arguments were passed.
    asyncTaskArgArray = Array.prototype.slice.call(arguments, 4);
  }
  // Check if the first argument is the function and its name that ends with 'loopasync'
  if (Array.isArray(asyncTaskArgArray) && typeof asyncTaskArgArray[0] === 'function' &&
    asyncTaskArgArray[0].name.toLowerCase().endsWith('loopasync')) {
    // Remove the function from the array.
    argumentFunction = asyncTaskArgArray.shift();
    // If it is a valid function call it by passing the rest of the arguments.
    const argumentsForAsyncTask = argumentFunction(option.currentIteration, asyncTaskArgArray);

    // Enforce that the '(methodName)loopAsync' method returns an array
    if (!Array.isArray(argumentsForAsyncTask)) {
      throw new Error('utils#loopAsync() *LoopAsync() method must return an array.');
    }
    asyncTaskArgsLength = argumentsForAsyncTask.length;

    // Merge the returned array with the original arguments, needed to be passed
    // to the asyncTask method.
    asyncTaskArgArray = argumentsForAsyncTask.concat(asyncTaskArgArray);
  }

  return new Promise((resolve: (p: any) => void, reject: (p: any) => void) => {

    // Call the async task by setting the context and passing the arguments.
    Promise.resolve(asyncTask.apply(thisArg, asyncTaskArgArray))
      .then((response: any) => {

        // Push the result into the response array.
        asyncTaskResultArray.push(response);

        // Call loopAsync recursively by passing the arguments.
        if ((iterateUntilFn && iterateUntilFn(option.currentIteration)) ||
          (typeof option.currentIteration === 'number' &&
            (option.currentIteration < (option.times - 1)))) {

          // Increment the iteration count
          option.currentIteration++;

          // If the '(methodName)loopAsync' method was provided.
          if (argumentFunction) {
            // Remove the arguments from the array that was returned by
            // calling '(methodName)loopAsync' in previous step.
            asyncTaskArgArray.splice(0, asyncTaskArgsLength);

            return loopAsync.apply(loopAsync,
              [thisArg, asyncTaskResultArray, asyncTask, option, argumentFunction]
                .concat(asyncTaskArgArray));
          }

          // Default call i.e. '(methodName)loopAsync' method was not provided.
          return loopAsync.apply(loopAsync, [thisArg, asyncTaskResultArray, asyncTask, option]
            .concat(asyncTaskArgArray));
        }

        return Promise.resolve(asyncTaskResultArray);
      })
      .then((response: any) => {
        // Resolve the main Promise
        resolve(response);
      })
      .catch((error: any) => {
        // Reject the main Promise
        reject(error);
      });
  });
}
