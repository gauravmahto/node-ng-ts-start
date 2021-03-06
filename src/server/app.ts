/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

import './globals';

// Import Test module.
import { SerializedAsync, SerializedAsync2 } from './async-utils';
import { default as Test, loopAsync } from './test-module';

import express from 'express';

// Import ends.

const log = console.log;

const app = express();

app.use(express.static(global.clientSrc));

app.get('/ping', ({ }, res: express.Response) => {

  res.send('Ping success.');

});

app.listen(80, () => {
  log('Server started on port 80');
});

// region - Test code execution.

// region - Loop async test
const out = '';
let reverse = 5;
function testP(id: number, name: string): Promise<any> {
  return new Promise((res) => {

    setTimeout(() => {
      log('testP' + out, id, name);
      if (out.length) {
        res(id + '' + reverse--);
      } else {
        res(id);
      }
    }, 1000);

  });
}

const argsArr = [{
  id: 1,
  name: 'A'
}, {
  id: 2,
  name: 'B'
}, {
  id: 3,
  name: 'C'
}, {
  id: 4,
  name: 'D'
}, {
  id: 5,
  name: 'E'
}];

function argsLoopAsync(cItr: number): any[] {
  return [argsArr[cItr].id, argsArr[cItr].name];
}

// const resultArr: any[] = [];
// loopAsync(this, resultArr, testP, {
//   times: argsArr.length
// }, argsLoopAsync, argsArr[0].id, argsArr[0].name);

// const serializedAsync = new SerializedAsync();
// serializedAsync.forEach(testP, {
//   getArguments: argsLoopAsync,
//   until: argsArr.length
// })
//   .then((result: any[]) => {
//     log(result);
//   })
//   .then(() => {
//     out = '1';

//     return serializedAsync.forEach(testP, {
//       getArguments: argsLoopAsync,
//       until: argsArr.length
//     });
//   })
//   .then((result: any[]) => {
//     log(result);
//   });

// const serializedAsync2 = new SerializedAsync2();
// serializedAsync2.push(1, 2, 3, 4);
// serializedAsync2.asyncEach((val: number, index: number, arr: any[], resume: any) => {
//   log(val);
//   testP(index, index + '-' + index)
//     .then(resume);
// });

// endregion loopSync

// region - loop using recursion, async and non-async

Array.prototype.asyncEach = function <T>(iterator: (value: T, index: number, resume: () => void) => void) {

  const list: T[] = this;
  const length = list.length;
  let currentIndex = -1;
  let calls = 0;
  let looping = false;

  const iterate = () => {

    calls -= 1;
    currentIndex += 1;

    if (currentIndex === length) {

      return;

    }

    iterator(list[currentIndex], currentIndex, resume);

  };

  const loop = () => {

    if (looping) {

      return;

    }

    looping = true;

    while (calls > 0) {

      iterate();

    }

    looping = false;

  };

  const resume = () => {

    calls += 1;

    if (typeof setTimeout === 'undefined') {

      loop();

    } else {

      setTimeout(iterate, 0);

    }

  };

  resume();

};

// [1, 2, 3, 4].asyncEach((value, index, resume) => {
//   log(value);
//   resume();
// });

// endregion - loop using recursion

// region - Observable

const testClass = new Test();
// const { next, observable } = testClass.testA();
// const timer = setInterval(next, 1000);
// observable.subscribe((val) => {
//   if (val === 10) {
//     clearInterval(timer);
//   }
// });
const one = testClass.testB('Hi');

one
  .subscribe((val) => log(val));

// testClass.addToB(one)
//   .subscribe((val) => console.log(val));

// endregion - Observable

// endregion - Test code execution.

// region - Type test

class TestClass { }

function create<T>(ctor: { new(): T }) {
  return new ctor();
}
const c = create(TestClass); // c: Test

function isReallyInstanceOf<T>(ctor: { new(...args: any[]): T }, obj: T) {
  return obj instanceof ctor;
}

// endregion - Type test

// //type pluck<T, K extends keyof T> = (o: T, names: K[]): Array<T[K]>

// interface Person {
//   name: string;
//   age: number;
// }
// const person: Person = {
//   name: 'Jarid',
//   age: 35
// };
// //const strings: string[] = pluck(person, ['name', 'age']);

let inputChunks: string = '';
process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    inputChunks += chunk;
  }
});

process.stdin.on('end', () => {
  let output;
  try {
    const parsedData = JSON.parse(inputChunks);
    output = JSON.stringify(parsedData, null, '    ');
  } catch (err) {
    output = inputChunks;
  }
  process.stdout.write('Out: ', output);
  process.stdout.write('\n');
});
