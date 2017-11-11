function getPromise(): Promise<string> {
  
    return new Promise((resolve: Function) => {
  
      resolve('Hi');
  
    });
  
  }
  
  function getTimeout(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  }
  
  async function test2() {
    for(let index: number = 0; index <= 5; index++) {
      
        await getTimeout();
        console.log(await getPromise());
      
      }
  }
  
  test2();
  
  // Generics #1
  
  /**
   * Test class.
   */
  class Test<T> {
  
    private val: T | null;
  
    constructor() {
      this.val = null;
    }
  
    set data(data: T) {
      this.val = data;
    }
  
  }
  
  const test_i = new Test();
  test_i.data = '';
  
  // Generics #2
  
  interface GenericIdentityFn {
    <T>(arg: T): T;
  }
  
  function identity<T>(arg: T): T {
    return arg;
  }
  
  let myIdentity: GenericIdentityFn = identity;
  
  // Generics #3
  interface GenericIdentityFn1<T> {
    (arg: T): T;
  }
  
  function identity1<T>(arg: T): T {
    return arg;
  }
  
  let myIdentity2: GenericIdentityFn1<number> = identity1;
  
  // Generics #4
  class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
  }
  
  let myGenericNumber = new GenericNumber<number>();
  myGenericNumber.zeroValue = 0;
  myGenericNumber.add = function(x, y) { return x + y; };
  
  // Generics #5
  interface Lengthwise {
    length: number;
  }
  
  function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
  }
  
  loggingIdentity<string>("abcd");