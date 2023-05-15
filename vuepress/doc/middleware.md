<!--
 * @Author: chenzhongsheng
 * @Date: 2023-05-13 17:15:15
 * @Description: Coding something
-->

# 中间件

中间件是 Sener 中的核心概念，Sener 本身只提供一个解析请求的处理响应的管道，具体的功能交由不同的中间件通过hooks来实现

```js
new Sener({
  middlewares: [mw1, mw2],
})
```

注：middlewares 可以传入null，null值会被忽略而不会报错，在以下场景中可以减少一定代码量

```js
new Sener({
  middlewares: [
    isDev ? devMiddleware: null,
  ],
})
```

## 概念

Sener中间件是一个包含某些特定属性和hook函数的对象，以下是一个中间件的接口

```ts
export interface IMiddleWare {
    name?: string;
    acceptOptions?: boolean;
    enter? (ctx: ISenerContext): IPromiseMayBe<IHookReturn> {};
    request? (ctx: ISenerContext): IPromiseMayBe<IHookReturn> {};
    response? (ctx: ISenerContext): IPromiseMayBe<IHookReturn> {};
    leave? (ctx: ISenerContext): IPromiseMayBe<IHookReturn> {};
    helper? (): Record<string, any> {};
}
```

以下为属性的详细介绍，其中所有的属性和方法都是可选的

1. name: 中间件名称
2. acceptOptions: 是否接受options method，默认为false，即options method 不会 传入到hook中
3. helper: 生成工具的hook，在中间件被use之后就会被执行，sener会将helper返回结果注入到context中
4. enter: 请求进入的hook，该hook不能拦截请求直接返回，也不会阻塞后续中间件执行，所有的enter hook都会被执行
5. request: 请求hook，该hook可以拦截请求直接返回，也可以跳过后续中间件的request hook
6. response: 响应hook，该hook可以拦截请求直接返回，也可以跳过后续中间件的response hook
7. leave: 请求离开的hook，该hook不能拦截请求直接返回，也不会阻塞后续中间件执行，所有的leave hook都会被执行

## 洋葱模型

中间件有五个的hook，hook的执行顺序遵循洋葱模型，如下图所示：

// todo 返回示意图

解析请求 -> 初始化helper -> enter -> request -> response -> leave -> 返回响应

该模型的好处是可以保证先进入的中间件后离开，可以固定不同组件的执行优先级

## hook分类

sener中间件hook可以分为三类，`初始化hook`、`非阻塞hook`和`阻塞hook`

1. 初始化hook只有一个，便是helper，该hook会在中间件被use之后就会被执行，将返回值注入到context中供后续中间件使用

2. 非阻塞hook有两个 enter个leave，这两个hook不能拦截请求，只能通过返回值注入修改context

3. 阻塞hook有两个 request和response，这两个hook可以通过返回值控制是否提前结束请求或者跳过后续同类型的hook，也可以通过返回值注入修改context

## hook返回值

hook通过返回值类注入或修改context，也可以通过返回值控制请求流程，以下为hook返回值的类型

```ts
export type IHookReturn = Partial<ISenerContext>|MiddleWareReturn|void|false;

export enum MiddleWareReturn {
  Continue = 'Continue',
  Break = 'Break',
  Return = 'Return',
}
```

当为阻塞hook且返回值是 'Return' 或者 false 时，请求会被直接返回，这种情况需要开发自行处理http响应，可以搭配sener的send helper方法来返回响应

当为阻塞hook且返回值是 'Break' 时，后续的相同hook会被跳过

当返回值是 `Partial&lt;ISenerContext&gt;` 时，返回结果会被注入到 context 中引入

其他类型的返回值则会不影响整个请求过程

## 自定义中间件

除了使用官方的中间件之外，开发者也可以定义自己的中间件，有两种定义方式：

1. 第一种是推荐方式，继承 MiddleWare 抽象类

```ts
import { MiddleWare } from 'sener';
export class CustomMiddle extends MiddleWare {
    // 声明hook等
}

const customMiddle = new CustomMiddle();
```

2. 第二种是声明一个json作为中间件，如果是ts，可以通过 IMiddleWare 接口获得类型提示

```ts
import { IMiddleWare } from 'sener';
const customMiddle: IMiddleWare = {

}
```

以下是一个自定义登录态校验的简单中间件示例

```ts
import { MiddleWare, ISenerContext, IHookReturn } from 'sener';

export class LoginCheck extends MiddleWare {
    response (ctx: ISenerContext): IHookReturn {
        if (!ctx.meta.tk) return; 
        // 通过路由meta属性判断是否需要进行登录校验 此部分需要参考后续的router中间件
        const result = checkLogin(); // 待实现
        if (!result.success) {
            ctx.sendJson(result.data);
            return false; // 用false来提前离开 跳过后续的所有hook
        };
        // 登录成功则注入uid
        const uid = result.data.uid;
        ctx.query.uid = uid;
        ctx.body.uid = uid;
    }
}
```

## 自定义context

如果使用的typescript，可以通过扩展 ISenerContext 接口来提供更友好的类型支持

使用以下声明可以扩展ISenerContext接口

```ts
// tood 优化
declare module 'sener' {
  interface ISenerHelper {
    customArrtibute: {},
    customHelper: {},
  }
}
```
