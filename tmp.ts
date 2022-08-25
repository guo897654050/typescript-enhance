class F1 {
  constructor() { }

  handler() {
    console.log(222)
  }
}


const f1 = new F1();

console.log('prototype', f1, Reflect.getPrototypeOf(f1))