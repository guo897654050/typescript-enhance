type ClassStruct<T = any> = new (...args: any[]) => T

export class Container {
  private static services: Map<string, ClassStruct> = new Map();

  public static set(key: string, value: ClassStruct): void {
    Container.services.set(key, value)
  };

  public static get<T = any>(key: string): T | undefined {
    //检查是否注册
    const Cons = Container.services.get(key);
    if (!Cons) {
      return undefined
    }
    //实例化
    const ins = new Cons();

    //遍历注册信息
    for (const info in Container.propertyRegisty) {
      const [injectKey, serviceKey] = info;

      const [classKey, propKey] = injectKey.split(':');

      // 不是这个类跳过
      if (classKey !== Cons.name) continue

      //取出注入的类，这里已经实例化
      const target = Container.get(serviceKey)

      if (target) {
        ins[propKey] = target;
      }

      return ins
    }
  };

  private constructor() { }

  public static propertyRegisty: Map<string, string> = new Map();

}


export function Provide(key: string): ClassDecorator {
  return (target) => {
    Container.set(key, target as unknown as ClassStruct)
  }
}


export function Inject(key: string): PropertyDecorator {
  return (target, propertyKey) => {
    Container.propertyRegisty.set(
      `${target.constructor.name}:${String(propertyKey)}`,
      key
    )
  }
}