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
    acceptResponded?: boolean;
    acceptReturned?: boolean;
    helper?(): Record<string, any>;
    init?: (ctx: ISenerContext) => IMiddleWareInitReturn;
    enter?: (ctx: ISenerContext) => IMiddleWareEnterReturn;
    leave?: (ctx: ISenerContext) => IPromiseMayBe<void>;
}
```

以下为属性的详细介绍，其中所有的属性和方法都是可选的

1. name: 中间件名称
2. acceptOptions: 是否接受options method，默认为false，即options method 不会 传入到hook中
3. acceptResponded: 是否接受已经标为 responded（即已经构造过响应） 的context。默认值为false
4. acceptReturned: 是否接受已经标为 returned （即已经返回过响应）的context。默认值为false
5. helper: 生成工具的hook，在中间件被use之后就会被执行，sener会将helper返回结果注入到context中
6. init: 初始化hook，该hook会最先执行，一般建议插入一些自定义context或者修改context内容。
7. enter: 请求进入的hook，一般建议在这个中间件中处理响应，返回响应数据。
8. leave: 请求离开的hook，此时请求响应已发送给客户端，所以该hook的返回值无意义，一般用于做一些状态销毁的操作，如关闭数据库连接。

## 洋葱模型

中间件有三个hook，hook的执行顺序遵循洋葱模型，`解析请求` -> `init` -> `enter` -> `返回响应` -> `leave`。如下图所示：

![Sener-Hooks](https://shiyix.cn/images/sener-hooks.png)

该模型的好处是可以保证先进入的中间件后离开，可以固定不同组件的执行优先级

## hook逻辑

### helper

helper 用于注入一下静态的工具方法或状态到context中，该 hook 在中间件被use之后就会执行，且只会执行这一次，helper返回的一个json，sener会将返回值注入到每次请求的context中

### init

init hook 是中间件在请求过程中的初始化hook，一般用于修改context或自定义context，一般不建议做与请求响应相关的操作。

init 返回值类型为 Partial&lt;ISenerContext> 

### enter

enter hook 用于中间件状态的初始化或处理请求响应。

enter 返回值类型为 Partial&lt;ISenerContext> 

### leave

leave hook 在请求响应被发送到客户端之后执行，一般用于销毁中间件的某些状态，比如断开数据库连接等。leave中间件不需要有任何返回值

> 注：一般建议在 enter hook中处理与响应相关的context，即 data，statusCode，headers，success 四个属性，包裹调用context的工具方法。建议在init hook中操作或自定义其他context。

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
    enter (ctx: ISenerContext): IHookReturn {
        if (!ctx.meta.tk) return; 
        // 通过路由meta属性判断是否需要进行登录校验 此部分需要参考后续的router中间件
        const result = checkLogin(); // 待实现
        if (!result.success) {
            // 将一个json类型的失败响应注入到context
            return ctx.responseJson(result.data);
        };
        // 登录成功则注入uid
        const uid = result.data.uid;
        ctx.query.uid = uid;
        ctx.body.uid = uid;
    }
}
```

## 自定义context

以下是通过中间件自定义context的例子：

```ts
import { MiddleWare, ISenerContext, IHookReturn } from 'sener';

export class LoginCheck extends MiddleWare {
    init (ctx: ISenerContext): IHookReturn {
      ctx.uid = 'xxx'; // 直接修改
      return {
        customArrtibute: 'xx', // 通过返回值修改
        customHelper(){
          return ctx.url;
        },
      }
    }
}
```

## ts 声明

如果使用的typescript，可以通过扩展 ISenerContext 接口来提供更友好的类型支持

使用以下声明可以扩展ISenerContext接口

```ts
declare module 'sener' {
  interface ISenerHelper {
    customArrtibute: {},
    customHelper: {},
  }
}
```
