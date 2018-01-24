/**
 * Copyright 2017 - Author gauravm.git@gmail.com
 */

declare module NodeJS {

  interface Global {

    projectRoot: string;
    clientSrc: string;

  }

}

declare interface Array<T> {
  asyncEach(iterator: (value: T, index: number, resume: () => void) => void): void;
}
