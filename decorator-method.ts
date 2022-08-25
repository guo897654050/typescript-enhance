class Boo {
  @ComputerTime()
  async fetch() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('res')
      }, 1000)
    })
  }
}

function ComputerTime(): MethodDecorator {
  const start = new Date();
  return (
    _target, //类
    methodIdentifier,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    console.log('类本身', _target)
    console.log('函数名称', methodIdentifier)
    console.log('属性描述符', descriptor)
    const originalMethodImpl = descriptor.value;
    descriptor.value = async function (...args: unknown[]) {
      const res = await originalMethodImpl.apply(this, args);
      const end = new Date();
      console.log(
        `${String(methodIdentifier)} Time:`, end.getTime() - start.getTime()
      )
      return res;
    }
  }
}

const boo = new Boo();
boo.fetch()

