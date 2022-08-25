import 'reflect-metadata'

export enum METADATA_KEY {
  METHOD = 'ioc:method',
  PATH = 'ioc:path',
}

export enum REQUEST_METHOD {
  GET = 'ioc:get',
  POST = 'ioc:post'
}


export const Controller = (path?: string): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(METADATA_KEY.PATH, path ?? '', target)
  }
}

export const requestMethodDecorator = (method: string) => {
  return (path: string): MethodDecorator => {
    return (_target, _key, descriptor) => {
      // 定义在方法上的metadata
      Reflect.defineMetadata(METADATA_KEY.METHOD, method, descriptor.value!);
      Reflect.defineMetadata(METADATA_KEY.PATH, path, descriptor.value!);
    }
  }
}


export const Get = requestMethodDecorator(REQUEST_METHOD.GET);
export const Post = requestMethodDecorator(REQUEST_METHOD.POST);

interface ICollected {
  path: string,
  requestMethod: string;
  requestHandler: (...args: any[]) => Promise<any>
}


export const routerFactory = <T extends Object>(ins: T): ICollected[] => {
  const prototype = <any>Reflect.getPrototypeOf(ins);

  // 拿到类上面的注入数据
  const rootPath = Reflect.getMetadata(METADATA_KEY.PATH, prototype.constructor);

  // 拿到类的方法 除了构造函数
  const methods = Reflect.ownKeys(prototype).filter((item) => item !== 'constructor');

  const collect = methods.map((m) => {

    const handler = prototype[m];
    const path = Reflect.getMetadata(METADATA_KEY.PATH, handler)
    const requestMethod = Reflect.getMetadata(METADATA_KEY.METHOD, handler).replace('ioc:', '')

    return {
      path: `${rootPath}${path}`,
      requestMethod,
      requestHandler: handler,
    }
  })
  return collect;
}

