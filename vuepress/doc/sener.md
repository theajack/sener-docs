<!--
 * @Author: chenzhongsheng
 * @Date: 2022-11-05 10:51:06
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-21 12:46:37
-->

# 概念与基础

## Sener构造

开发者可以使用 Sener 启动一个服务器，该构造函数接收一个可选的json参数，包含有以下三个可选属性：

1. port: 指定服务器的端口号，默认值为9000
2. middlewares: 传入一个中间件数组，默认为 []
3. onerror: 自定义处理请求中的错误，默认为空，交由sener处理

```js
import {Sener} from 'sener';
new Sener(); 
```

带有参数
```js
import {Sener} from 'sener';
new Sener({
    port: 9000,
    middlewares: [],
    onerror({error, from, context}){
        // ...do something
    }
}); 
```

onerror 回调参数如下

```ts
export type IOnError = (err: {
  error: any,
  from: IErrorFrom,
  context: ISenerContext
}) => IPromiseMayBe<ISenerResponse>;
```

你可以从 sener 中引入 IOnError 接口

```ts
import {IOnError} from 'sener';
```

1. error 为请求过程中抛出的错误
2. from 为抛出错误的阶段，可选值为 'enter' | 'request' | 'response' | 'leave'
3. context 为请求的上下文，下面会介绍到

## 请求上下文

请求上下文 (ISenerContext) 是 Sener 中非常重要的一个概念，它是一个json对象，包含许多重要的属性，上下文用于中间件hooks中，后续中间件章节会着重介绍

```ts
import {ISenerContext} from 'sener';
```

ISenerContext 属性与介绍如下

```ts
interface ISenerContext {
    requestHeaders: IncomingHttpHeaders; // 请求的header
    url: string; // 请求的url
    method: IServeMethod;
    query: IJson<any>;
    body: IJson<any>; // body解析的json
    buffer: Buffer|null; // 请求body的原始数据
    ip: string; // 客户端ip

    request: IncomingMessage; // http模块原生的request对象
    response: IResponse;  // http模块原生的response对象
    env: ISenerEnv & IJson; // env中间件注入的环境变量
    responded: boolean; // 标记是否已经构造了响应
    isOptions: boolean; // 标记是否是options请求
    returned: boolean; // 标记是否已经发送了响应

    // 响应返回
    data: T, // 响应返回的数据
    statusCode: number, // 响应返回的错误码
    headers: IJson<string>; // 响应返回的header
    success: boolean; // 表示请求是否成功

    ...ISenerHelper; // 该参数为中间件自定义的helper 后续自定义中间件章节中会介绍到

    // 工具函数
    response404: (errorMessage?: string, header?: IJson<string>) => ISenerResponse; // 构造404响应
    responseJson: (data: IJson, statusCode?: number, header?: IJson<string>) => ISenerResponse; // 构造json响应
    responseText: (text: string, statusCode?: number, header?: IJson<string>) => ISenerResponse; // 构造文本响应
    responseHtml: (html: string, header?: IJson<string>) => ISenerResponse; // 构造html响应
    responseData: (data: Partial<ISenerResponse>) => ISenerResponse; // 构造通用响应
    markReturned: () => void; // 标记为已提前返回响应
}
```

## 工具方法

从上面小节的声明中可以看出，context 中含有六个工具方法

markReturned 工具方法用于在通过原生 response 已经发送响应到客户端之后，标记已发送状态，这就可以跳过后续不需要的中间件和返回响应。

其他五个 responseXXX 方法为构造响应合并到 context 中，本身并不会直接返回响应

工具方法可以在自定义中间件或router中使用，详细使用可以参考 router中间件

## 其他Api

### 1. use

use 用于动态添加一个中间件

```js
const sener = new Sener();
sener.use(customMiddleware);
```

### 2. remove

remove 用于动态移除一个中间件

```js
const sener = new Sener();
sener.remove(customMiddleware);
```

### 3. Dir

Dir 是一个静态属性 用于获取或设置Sener的数据根目录

默认值为 homedir() + './sener-data'

```js
Sener.Dir;
Sener.Dir = '/custom-dir';
```

### 3. Version

Version 是一个静态属性 用于获取版本号

```js
Sener.Version;
```