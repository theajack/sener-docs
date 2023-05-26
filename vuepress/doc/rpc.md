<!--
  * @Author: chenzhongsheng
  * @Date: 2023-05-14 14:49:08
  * @Description: Coding something
-->
# rpc middleware

## Install and use

The rpc middleware is an independent middleware and needs to be installed and used separately

```
npm i sener-rpc
```

```js
import { RPC } from 'sener-rpc';
new RPC();
```

## Basic usage

The rpc middleware is used for remote call support, internally compatible with server and client requests, and supports both server and client.

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
     comment: 'http://localhost:9001/comment', // specify the address of the comment service
   })],
});
```

## Request object

The Request object is an important concept in RPC. The Request object encapsulates some methods for initiating HTTP requests, and supports both the server and the client. The following is the class declaration of the Request object:

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

### request method

The request method is the basic method for initiating http requests

The parameters and return values are as follows

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

The post, get, and postForm methods all encapsulate the request method, and the postForm method is used to send formdata data

### parseResult method

The parseResult method is used to parse IRequestReturn data and convert it to IParsedData

```ts
interface IBoolResult {
   success: boolean;
   msg?: string;
}
type IParsedData = IBoolResult & IJson;
```

The postReturn, getReturn, and requestReturn methods will first call the corresponding request method, and then convert the return value through parseResult and return it.

### Interceptors

Request has two static interceptors, Interceptor and OnResponse

The Interceptor interceptor is used to intercept the request before the request starts, you can modify the request parameters and then continue the request

Or return a response directly, and no more requests will be made

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

The OnResponse interceptor is used to modify the result returned by the request after the request is completed. or return a new response directly

```ts
type IRPCRequestOnResponse = (data: IRPCResponse) => void|IRPCResponse;
```

## Custom Request object

We can encapsulate our own service business logic by inheriting the Request object

```js
import { Request } from 'sener-rpc';
interface IUser {
     name: string;
     age: number;
     pwd: string;
}
class UserRequest extends Request {
     await regist(data: IUser){
         // If you are using ts, you can use generics to get better type support
         const data = await this. postReturn<IUser>('/user/regist', data);
         // can do some business logic processing
         return data;
     }
}
```

## Construction parameters

The construction parameter supports passing in key-value pairs or a function whose return value is IJson&lt;Request|any>, declared as follows:

```ts
type IOptions = IJson<string> | ((traceid:string) => IJson<Request|any>);
```

### Use key-value pairs as parameters

Use key-value pairs to represent the name and service address of a set of remote services, as shown in the following figure

```js
new RPC({
     comment: 'http://localhost:9001/comment', // specify the address of the comment service
     goods: 'http://localhost:9002', // specify the address of the goods service
     //...
})
```

rpc will construct a Request object through a key-value pair to make a convenient remote call. In the basic example, rpc.comment is a Request object.

### Using functions as parameters

When using a function as a parameter, it is used to pass in a custom Request object. The function accepts a traceid parameter. This parameter is used to ensure that the traceid is consistent when the server is called remotely, and it needs to be used as a construction parameter of the Request. The use of traceid and log middleware can effectively locate the problem


Use as follows

```js

function createServices(traceid) {
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

## web client use

The client needs to use the WebRPC object

```js
import {WebRPC} from 'sener-rpc/dist/web.umd';

// 1. A single service can pass in the base address
const comment = new WebRPC('http://localhost:3001');
await comment. get('/message', {page: 1});

// 2. Multiple services are passed into the map
const rpc = new WebRPC({
     user: 'http://localhost:3000', // access base address of user service
     comment: 'http://localhost:3001', // access base address of comment service
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