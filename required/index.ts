import 'reflect-metadata'

// 模仿实现必填项的装饰器操作


enum TypeValidation {
  Number = 'number',
  String = 'string',
  Boolean = 'boolean'
}

// TODO requried
const requiredKey = Symbol('requiredKeys')
// 目的是拿到所有的具有requird的prop
function Required(): PropertyDecorator {
  return (target, prop) => {
    // 先拿一下已经有required的prop
    // 之所以metadata没有定义在prop上，因为可能不存在这个属性，可直接定义在类上
    const existsRequiredProp = Reflect.getMetadata(requiredKey, target) ?? [];
    Reflect.defineMetadata(
      requiredKey,
      [...existsRequiredProp, prop],
      target
    )
  }
}


//TODO valueType
const TypeValidationKey = Symbol('TypeValidationKey')

function ValueType(type: TypeValidation): PropertyDecorator {
  return (target, prop) => {
    // 定义在prop上的metadata
    Reflect.defineMetadata(TypeValidationKey, type, target, prop)
  }
}

// TODO validate 校验方法
// 入参类的实例
function validate(entity: any) {

  //拿到类的构造函数
  const clsName = entity.constructor.name;

  // 拿到所有props
  const allProps = Reflect.ownKeys(entity);
  // 拿到existprops
  const existsProps = Reflect.getMetadata(requiredKey, entity);
  const msg: string[] = [];


  // props校验required属性
  for (let prop of existsProps) {
    if (!allProps.includes(prop)) {
      msg.push(
        `${clsName}.${prop} should be required.`
      )
    }
  }

  //校验类型
  for (let prop of allProps) {
    // 拿到类型
    const expectType = Reflect.getMetadata(TypeValidationKey, entity, prop);
    if (!expectType) continue

    if (Object.values(TypeValidation).includes(expectType)) {
      const actualType = typeof entity[prop];
      if (expectType !== actualType) {
        msg.push(
          `expect ${entity.constructor.name}.${String(prop)} to be ${expectType}, but got ${actualType}.`
        )
      }
    }
  }

  return msg;
}


class User {
  @Required()
  name!: string;

  @ValueType(TypeValidation.Number)
  age!: number;
}

const user = new User();

// @ts-expect-error
user.age = '18';


console.log('after validate', validate(user))