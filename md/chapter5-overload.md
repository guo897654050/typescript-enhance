#### 函数重载
在某些逻辑较为复杂的情况下，函数可能有多组入参和返回值类型。
例如
```javascript
function func(foo: number, bar?: boolean) string | number {
  if(bar) {
    return string(foo)
  } else {
    return foo * 100
  }
}
```

> 如何利用函数重载实现？
1. 定义函数签名，将所有的返回类型都定义出来
```javascript
// bar这种可以成为字面量类型
function func(foo: number, bar: true): string;

function func(foo: number, bar?: false): number

```
2. 完善签名实现逻辑
```javascript
functuon func(foo: number, bar?: boolean) {
  if(bar) {
    return string(foo)
  } else {
    return foo * 100
  }
}
```

#### 为什么使用函数重载？而不直接使用联合类型。
使用函数重载可以通过入参的类型来直接确定返回值的函数类型。


### ts类型

#### 类的关键字
1. public：此类成员在类、类的实例、子类中都能被访问。
2. private：此类成员仅能在类的内部被访问。
3. protected：此类成员仅能在类与子类中被访问，你可以将类和类的实例当成两种概念，即一旦实例化完毕（出厂零件），那就和类（工厂）没关系了，即不允许再访问受保护的成员。


#### 类的赋值
实际上我们通过构造函数为类成员赋值的方式还是略显麻烦，需要声明类属性以及在构造函数中进行赋值。简单起见，我们可以在构造函数中对参数应用访问性修饰符
```javascript
class Foo {
  constructor(public arg1: string, private arg2: boolean) { }
}

new Foo("linbudu", true)

// 如果已知默认值，也可以写成如下形式
class Foo {
  public arg1 =  ''
  private arg2 = false;
}
```

#### 静态成员
使用`static`来表示一个成员为静态成员。
```javascript
class Foo {
  static staticHandler() {}
  public instanceHandler() {}
}
```
与实例成员不同的是，在类的内部静态成员无法通过this访问，需要通过`Foo.staticHandler`方式访问。以下是class编译后的结果。
```javascript
var Foo = /** @class */ (function () {
    function Foo() {
    }
    Foo.staticHandler = function () { };
    Foo.prototype.instanceHandler = function () { };
    return Foo;
}());
```
可以看到
 - 静态成员会被挂在函数体上，而实例挂在原型上。
 - 静态成员不会被实例继承，它使用只属于当前定义的这个类（以及其子类），意思是无论当前类或者当前类的子类实例化，都无法继承该方法。

#### 类的继承
可以成为父类和子类，标准的称谓是`基类`和`派生类`。
```javascript
class Base {
  print() { }
}

class Derived extends Base {
  print() {
    super.print()
    // ...
  }
}
```
在派生类中覆盖基类方法时，我们并不能确保派生类的这一方法能覆盖基类方法，万一基类中不存在这个方法呢？所以，TypeScript 4.3 新增了`override` 关键字，来确保派生类尝试覆盖的方法一定在基类中存在定义：
```javascript
class Base {
  printWithLove() { }
}

class Derived extends Base {
  // 若父类没有print方法 会报错
  override print() {
    // ...
  }
}
```
在这里 TS 将会给出错误，因为尝试覆盖的方法并未在基类中声明。通过这一关键字我们就能确保首先这个方法在基类中存在，同时标识这个方法在派生类中被覆盖了。

#### 抽象类和接口
1. 抽象类中每个被`abstract`关键字描述的方法或者变量，都需要类中被实现。
```javascript
abstract class AbsFoo {
  abstract absProp: string;
  abstract get absGetter(): string;
  abstract absMethod(name: string): string
}

class Foo implements AbsFoo {
  absProp: string = "linbudu"

  get absGetter() {
    return "linbudu"
  }

  absMethod(name: string) {
    return name
  }
}
```

使用类来完善接口
```javascript
interface FooStruct {
  absProp: string;
  get absGetter(): string;
  absMethod(input: string): string
}

class Foo implements FooStruct {
  absProp: string = "linbudu"

  get absGetter() {
    return "linbudu"
  }

  absMethod(name: string) {
    return name
  }
}
```

#### 为类的构造函数添加private关键字

```javascript
class Foo {
  private constructor() { }
}
```

类的构造函数被标记为私有，且只允许在类内部访问。
那这就很奇怪了，我们要一个不能实例化的类有啥用？摆设吗？

还真不是，有些场景下私有构造函数确实有奇妙的用法，比如像我一样把类作为 utils 方法时，此时 Utils 类内部全部都是静态成员，我们也并不希望真的有人去实例化这个类。此时就可以使用私有构造函数来阻止它被错误地实例化：
```javascript
class Utils {
  public static identifier = "linbudu";
  
  private constructor(){}

  public static makeUHappy() {
  }
}
```


#### solid原则




