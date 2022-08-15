### 什么是类型声明
所谓类型声明，其实就是`declare`用法。
```js
declare var f1: () => void;

declare interface Foo {
  prop: string
}
```


### 使用类型定义覆盖项目
1. 要使用一个 npm 包，但它发布的时间太早，根本没有携带类型定义，于是你的项目里就出现了这么一处没有被类型覆盖的地方。
2. 你想要在代码里导入一些非代码文件，反正 Webpack 会帮你处理，但是可恶的 TS 又报错了？
3. 这个项目在运行时动态注入了一些全局变量（如 window.errorReporter），你想要在代码里直接这样访问，却发现类型又报错了...
我们需要**通过额外的类型声明文件，在核心代码文件意外去提供对类型的进一步补全**

首先是无类型定义的npm包
```js
import foo from 'pkg'

const res = foo.hanlder();

```
这里的pkg是一个没有类型定义的npm包
```js
declare module 'pkg' {
  const hanlder: () => boolean;
}
```
现在我们的 res 就具有了 boolean 类型。

### 三斜线指令
三斜线指令就像是声明文件中的导入语句一样，作用是**声明当前的文件以来的其他类型声明**，这里的"其他类型声明"包括了ts的内置类型声明(`lib.d.ts`)，三方库类型声明以及自己提供的类型声明文件等。
`三斜线指令`必须放在文件的顶部才能生效。
本质是一个自闭和标签
```js
/// <reference path="./other.d.ts"> 
/// <reference types="node">
/// <reference lib="dom">
```

1. path是一个相对路径
2. 使用types的指令，其types的值是一个包名，也就是你想引入的`@types/`声明，如上面的例子实际生命是对`@types/node`的依赖
3. 使用lib导入的ts的内置声明，例子中声明了对`lib.d.ts`的依赖。

### 命名空间
