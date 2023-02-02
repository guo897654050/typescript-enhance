### 装饰器
装饰器本质就是一个函数，只不过入参是提前确定好的。ts的装饰器目前只能再类以及类成员上使用。


#### 类装饰器
类装饰器是直接作用在类上的装饰器，执行的入参只有一个，就是类本身。

```js
// 此例子装饰器自下向上执行
@AddProperty('test')
@AddMethod()
class Foo {
  public a = 1;
}


function AddMethod(): classDecorator {
  return (target: any) {
    // 原型的方法，就是类里面定义的非statci标注的方法
    target.prototype.newInstanceMethod = () => {
      console.log('Let add a new newInstance method!')
    } 
    // 不同于上面的添加到原型的方法
    target.newStaticMethod = () => {
      console.log('let us add a new static method!')
    }
  }
}

function AddProperty(value: string) {
  return (target: any) => {
    // 原型上的对象,实例化后的对象可以访问
    target.prototype.newInstanceProperty = value;
    //使用static定义的对象，类可以直接访问 比如Foo.newStaticProperty
    target.newStaticProperty = `static ${value}`
  }
}
```

一个类中可以同时拥有好几种装饰器，那么这些**不同的装饰器的执行时机与顺序如何的**


#### 方法装饰器
方法装饰器的入参包括**类的原型，方法名，以及方法的属性描述符**，通过属性描述符可以控制方法的内部实现。
```js
class Foo {
  @ComputeProfile
  async fetch() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('ooooo')
      }, 3000);
    })
  }
}

function ComputeProfile(): MethodDecorator {
  const start = new Date();
  return (
    _tartget, // 类的原型，而非类本身
    methodIdentifier,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethodImpl = descriptor.value;
    descriptor.value = async function(...args: unknown[]) {
      const res = await originalMethodImpl.apply(this, ...args);
      const end = new Date();
      console.log(
        `${String(methodIdentifier)} Time:`, end.getTime() - start.getTime();
      )
      return res;
    }
  }
}
```

#### 装饰器的执行机制
装饰器的执行机制包括**执行时机，执行原理，执行顺序**三个概念。

执行时机，装饰器本质就是一个函数，因此只要在类上定义了，**即使不去实例化这个类或者读取静态成员，也会正常执行，很多时候我们不会实例化具有装饰器的类，而是通过反射元数据能力来消费**。

在ts官方文档中给装饰器的应用顺序下了定义：
  1. 参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个实例成员。
  2. 参数装饰器，然后是方法装饰器，访问符装饰器，属性装饰器应用到每个实例成员。
  3. 参数装饰器应用到构造函数。
  4. 类装饰器应用到类。

例子
```js
function Deco(identifier: string): any => {
  console.log(`${identifier}执行`);
  return function() {
    console.log(`${identifier}应用`)
  }
}

@Deco('类装饰器')
class Foo {
  constructor(@Deco('构造函数装饰器') name: string) {}

  @Deco('实例属性装饰器')
  prop?: number;

  @Deco('实例方法装饰器')
  handler(@Deco ('实例方法参数装饰器') args: any) {}
}
```

可见执行顺序是**实例属性-实例方法参数-构造函数参数-类**，和上面不太一致啊，上面说参数装饰器先应用，因为上面的例子，我们先定义的属性和属性装饰器，因此属性参数装饰器先应用。


### 同类装饰的执行顺序
```js
@Deprecated()
@User()
@Internal
@Provide()
class Foo{}
```
这些装饰器的具体实现是。
1. 首先**自上而下**对装饰器的表达式求值，得到装饰器的实现，`@Internal`中即为实现internal方法，而`@provide()`中实现则需要进行一次求值。
2. 然后装饰器的实现**从下往上**调用，如这里是 Provide、Internal、User、Deprecated 的顺序。从这个角度来看，甚至有点像洋葱模型。

```js

function Foo(): MethodDecorator {
  console.log('foo in')
  return (target, identifier, descriptor) => {
    console.log('foo out');
  }
}

function Bar(): MethodDecorator {
  console.log('bar in');
  return (target, identifier, descriptor) => {
    console.log('bar out')
  }
}

const Baz(): MethodDecorator = (target, identifier, descriptor) => {
  console.log('baz apply')
}


class User {
  @Foo()
  @Bar()
  @Baz
  handler() {}
}
```