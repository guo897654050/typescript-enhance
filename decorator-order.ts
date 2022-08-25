// ts装饰器执行顺序，类的装饰器不需要类实例化也可以执行

function Deco(identifier: string): any {
  console.log(`${identifier}执行`)
  return function () {
    console.log(`${identifier}应用`)
  }
}

@Deco('类装饰器')
class T1 {

  constructor(@Deco('构造函数参数装饰器') name: string) { }

  @Deco('实例属性装饰器')
  public prop = 'prop'


  @Deco('实例方法装饰器')
  handler(@Deco('实例方法参数装饰器') name: string) { }

}



function m1(): MethodDecorator {
  console.log('m1 in!');
  return (_target, identifier, descriptor) => {
    console.log('m1 out!')
  }
}

function m2(): MethodDecorator {
  console.log('m2 in!');
  return (_target, identifier, descriptor) => {
    console.log('m2 out!')
  }
}

const m3: MethodDecorator = (target, identifier, descriptor) => {
  console.log('m3 apply!', target, identifier, descriptor);
}

class T2 {
  @m1()
  @m2()
  @m3
  handler() { }
}



