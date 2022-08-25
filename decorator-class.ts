@AddProperty('test')
@AddMethod()
class Foo {
  public a = 1;
}


function AddMethod(): ClassDecorator {
  return (target: any) => {
    // 原型的方法，就是类里面定义的非statci标注的方法
    target.prototype.newInstanceMethod = () => {
      return 'Let add a new newInstance method!'
    }
    // 不同于上面的添加到原型的方法
    target.newStaticMethod = () => {
      return 'let us add a new static method!'
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

const foo: any = new Foo()
console.log('装饰器创建的类的static方法', (Foo as any).newStaticMethod())
console.log('装饰器创建的static属性', (Foo as any).newStaticProperty)
console.log('装饰器创建的类的实例方法', foo.newInstanceMethod())
console.log('装饰器创建的类的实例属性', foo.newInstanceProperty)


