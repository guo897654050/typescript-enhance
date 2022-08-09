#### 枚举和对象的差异
1. 对象是单向映射的，只能从键映射到值，而枚举是双向映射的，既可以从枚举成员映射到枚举值，也可以从枚举值映射到枚举成员。
```javascript
enum Items {
  Foo,
  Bar,
  Baz,
}

const fooVal = Items.Foo // 0
const fooKey  = Items[0] // Foo
```
但是 需要注意的是，仅有值为数字的枚举成员才能够进行这样的双向枚举，`字符串枚举仍然只会进行单次映射`。

2. 常量枚举，只是声明多了一个const
```javascript
const enum Items {
  Foo,
  Bar,
  Baz
}
const fooVal = Items.Foo; //0
```

对于常量枚举，只能通过枚举成员访问枚举值，而不能通过枚举值访问枚举成员。