## tsconfig的一些常用配置项

### paths
一般用俩简化路径，相当于webpakc的alias，但是必须结合baseUrl来使用
```js
"paths": {
  "@/utils/*": ['./src/utils/*', './src/other/utils/*']
}
```

### noEmit与noEmitOnError
是否将构建产物写入文件系统，当noEmit开启式将不会写入，但是仍会执行侯建过程，包括了类型检查，语法检查和实际构建过程。而noEmitOnError则仅会在构建过程中有错误才会阻止写入。常用的是`tsc --noEmit`

### module
控制最终js产物使用的模块标准，常见的包括CommonJs,ES6,ESNext。

### declaration, declarationDir
主要用于控制声明文件的输出，其中declation接受一个布尔值，表示是否产生声明文件。而declationDir控制声明文件的路径，默认回个构建代码在一个位置。但是通过这个选项可以自定义。


### emitDeclationOnly
此配置会是的构建结果只含有声明文件(d.ts)，而不包含.js文件。


### isolatedModules
构建过程会使用ts配合其他构建起，例如esbuild，swc，babel等。通常类型检查由ts处理，构建器一般进行语法降级与打包。
由于这些构建器通常是独立地处理每个文件，这也就意味着如果存在如类型导入、namespace 等特殊语法时，它们无法像 tsc 那样去全面分析这些关系后再进行处理。此时我们可以启用 isolatedModules 配置，它会确保每个文件都能被视为一个独立模块，因此也就能够被这些构建器处理。
启用 isolatedModules 后，所有代码文件（不包括声明文件）都需要至少存在一个导入或导出语句（比如最简单的情况下可以使用 export {}），无法导出类型（ESBuild 并不知道这个值是类型还是值）以及无法使用 namespace 与常量枚举（常量枚举在构建后会被内联到产物中）。

除了这些构建器以外，isolatedModules 配置也适用于使用 TS Compiler API 中的 transpileModule 方法，这个方法类似于 Babel，不会生成声明文件，只会进行单纯的语法降级。


### esModuleInterop 与 allowsyntheticDefaultImports
这俩配置是为了解决esm和cjs的兼容性问题。
通常情况下，esm调用esm，cjs调用cjs没问题，但是如果ems调用cjs可能遇到问题
假设我们分别使用具名导入、默认导入和命名空间导入来导入 React：
```js
import { useRef } from "react"; // 具名导入（named import）
import React from "react"; // 默认导入（default import）
import * as ReactCopy from "react"; // 命名空间导入（namespace import）

console.log(useRef);
console.log(React.useState)
console.log(ReactCopy.useEffect)
```
编译之后(未开启esModuleInterop)
```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_2 = require("react");
const ReactCopy = require("react");
console.log(react_1.useRef);
console.log(react_2.default.useState); //变了
console.log(ReactCopy.useEffect);
```

可以看到默认导入的调用换成xx.default。具名导入和命名空间不变。
因为ts默认将cjs也视为esm，对于具名导入`module.exports.useRef`和`export const useRef = useRef`等价。但是cjs无默认导出，所以esm的`export defualt`强行等价于`module.exports.default`。

启用 esModuleInterop 配置的同时，也会启用 allowSyntheticDefaultImports 配置，这一配置会为没有默认导出的 CJS 模块“模拟”出默认的导出，以提供更好的类型提示。如以下代码：
```js
// handlers.js
module.exports = {
  errorHandler: () => {}
}

// index.js
import handlers from "./handlers";

window.onerror = handlers.errorHandler;
```

虽然这段代码转换后的实际逻辑没有问题，但由于这里并不存在 module.exports.default 导出，会导致在类型上出现一个错误。

启用 allowSyntheticDefaultImports 配置会在这种情况下将 handlers 中的代码模拟为以下的形式：
```js
const allHandlers = {
  errorHandler: () => {}
}

module.exports = allHandlers;
module.exports.default = allHandlers;
```