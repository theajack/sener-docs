<!--
 * @Author: chenzhongsheng
 * @Date: 2023-05-14 14:49:08
 * @Description: Coding something
-->
# rpc中间件

## 安装使用

rpc中间件为独立中间件，需要单独安装使用

```
npm i sener-rpc
```

```js
import { RPC } from 'sener-rpc';
new RPC();
```

## 基础使用

rpc 中间件用于远程调用支持，内部兼容了服务端和客户端请求，同时支持服务端和客户端使用。

```js
import { Sener, Router } from 'sener';
import { RPC } from 'sener-rpc';

const router = new Router({
    '/demo': async ({ col, rpc }) => {
        const data = await rpc.comment.postReturn('/add', {content: 'xxx'});
        return { data: {success: true} };
    },
});

new Sener({
  middlewares: [router, new RPC({
    comment: 'http://localhost:9001/comment', // 指定 comment 服务的地址
  })],
});
```

## Request对象

Request 对象是RPC中的一个重要概念，Request对象封装了一些用于发起http请求的方法，同时支持服务端和客户端。以下是Request对象的类声明：

```ts
interface IRequestConsOptions {
    base: string,
    headers?: IJson<string>;
    traceid?: string;
}
export class Request {
    base: string;
    headers: IJson<string> = {};
    traceid: string = '';
    tk = '';
    setToken (tk: string) { this.tk = tk; };

    static Interceptor: IRPCRequestInterceptor;
    static OnResponse: IRPCRequestOnResponse;

    constructor (options: IRequestConsOptions);

    get<T=any> (url: string, query: IJson = {}): IRequestReturn<T>;
    post<T=any> (url: string, body: IJson = {}, form = false): IRequestReturn<T>;
    postForm<T=any> (url: string, body: IJson = {}): IRequestReturn<T>;
    async request<T> (options: IRequestOptions): IRequestReturn<T>;

    async postReturn<T=any> (url: string, body: IJson = {}): IParsedData;
    async getReturn<T=any> (url: string, query: IJson = {}): IParsedData;
    async requestReturn<T=any> (url: string, data: IJson = {}): IParsedData;

    parseResult<T = any> (result: IRouterReturn<T>): IParsedData;
}
```

### request方法

request 方法是发起http请求的基础方法

参数与返回值如下

```ts
interface ICommonRequestOptions {
    headers?: IJson<string>;
    traceid?: string;
}

interface IRequestOptions extends ICommonRequestOptions {
    body?: IJson,
    query?: IJson,
    url: string,
    method?: IMethod,
    data?: IJson,
    form?: boolean,
    traceid?: string,
    base?: string,
}
```

```ts
type IRequestReturn<T=any> = Promise<IRouterReturn>;
type IRouterReturn<T=any> = ISenerResponse<IRouterData<T>>;
interface ISenerResponse<T = any> {
  data: T,
  statusCode?: number,
  headers?: IJson<string>;
  success?: boolean;
}
interface IRouterData<T=any> {
    code: number;
    data: T;
    extra?: any;
    msg?: string;
    success?: boolean;
}
```

post、get、postForm 方法皆是封装了request方法，其中postForm方法用于发送formdata数据

### parseResult方法

parseResult 方法用于解析 IRequestReturn 数据，将其转换为 IParsedData

```ts
interface IBoolResult {
  success: boolean;
  msg?: string;
}
type IParsedData = IBoolResult & IJson;
```

postReturn、getReturn、requestReturn 方法会先调用相应的 request方法，然后将返回值通过 parseResult 转换之后返回。

### 拦截器

Request 有两个静态的拦截器，Interceptor 和 OnResponse

Interceptor 拦截器用于在请求开始之前拦截请求，可以对请求参数进行修改然后继续请求

或者是直接返回一个响应，就不会再发起请求了

```ts
interface IRPCResponse {
    success: boolean,
    data?: any,
    code?: number,
    msg: string,
    err?: any,
    [prop: string]: any,
}
type IRPCRequestInterceptor = (data: IRequestOptions) => void|IRPCResponse;
```

OnResponse 拦截器用于在请求完成之后，可以对请求返回结果进行修改。或者是直接返回一个新的响应

```ts
type IRPCRequestOnResponse = (data: IRPCResponse) => void|IRPCResponse;
```

## 自定义Request对象

我们可以通过继承Request对象来封装自己的服务业务逻辑

```js
import { Request } from 'sener-rpc';
interface IUser {
    name: string;
    age: number;
    pwd: string;
}
class UserRequest extends Request {
    await regist(data: IUser){
        // 如果是使用ts，可以使用泛型获得更好的类型支持
        const data = await this.postReturn<IUser>('/user/regist', data);
        // 可以做一些业务逻辑处理
        return data;
    }
}
```

## 构造参数

构造参数支持传入键值对或者一个返回值为IJson&lt;Request|any>的函数, 声明如下：

```ts
type IOptions = IJson<string> | ((traceid:string) => IJson<Request|any>);
```

### 使用键值对作为参数

使用键值对表示声明一组远程服务的名称和服务地址，如下图所示

```js
new RPC({
    comment: 'http://localhost:9001/comment', // 指定 comment 服务的地址
    goods: 'http://localhost:9002', // 指定 商品 服务的地址
    // ...
})
```

rpc 会通过键值对构造 Request 对象来进行便捷的远程调用，基础使用的示例中 rpc.comment 便是一个 Request 对象。

### 使用函数作为参数

使用函数作为参数时，用于传入自定义的 Request对象，函数接受一个traceid的参数，该参数作用是用在服务端远程调用时保证traceid一致，需要作为 Request的构造参数。traceid与log中间件配合使用可以很有效的定位问题


使用如下

```js

function createServices (traceid) {
    return { 
        user: new UserRequest({
            base: 'http://localhost:9001/user',
            traceid,
        }),
        comment: new CommentRequest({
            base: 'http://localhost:9002/comment',
            traceid,
        })
    };
}
new RPC(createServices);
```

## web客户端使用

客户端使用时需要用到 WebRPC 对象

```js
import {WebRPC} from 'sener-rpc/dist/web.umd';

// 1. 单个服务可以传入base地址
const comment = new WebRPC('http://localhost:3001');
await comment.get('/message', {page: 1});

// 2. 多个服务传入map
const rpc = new WebRPC({
    user: 'http://localhost:3000', // user 服务的访问base地址
    comment: 'http://localhost:3001', // comment 服务的访问base地址
});
await rpc.comment.get('/message', {page: 1});

// 3. 使用继承方式
class Comment extends WebRPC {
    getList ({ app = 'common', index = 1 }: {
        app?: string
        index?: number
    } = {}) {
        return this.get('/message', {
            app,
            index,
            size: 10,
        });
    }
}
await (new Comment()).getList();
```

cdn 使用

```html
<script src='https://cdn.jsdelivr.net/npm/sener-rpc'></script>
<script>
  SenerRpc.WebRPC
</script>
```
