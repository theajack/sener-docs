<!--
 * @Author: chenzhongsheng
 * @Date: 2023-05-14 13:15:35
 * @Description: Coding something
-->
# Router 中间件

## 使用

router中间件是最为重要也是最为基础的一个中间件，它的功能是用来进行路由分发

以下是一个简单的使用

```js
import { Sener, Router } from 'sener';

const router = new Router({
    '/demo': ({ query }) => {
        // or: 'get:/demo': ({ query }) => { // get: prefix can be ignored
        query.message = 'from get';
        return { data: query };
        // Custom headers or statusCode
        // return { data: query, headers: {}, statusCode: 200  };
    },
    'post:/demo': async ({ body }) => {
        body.message = 'from post'
        return { data: body };
    },
});

new Sener({
  port: 9000,
  middlewares: [router],
});
```

需要注意的是 router 中间件一般建议放在第一个位置

也可以使用json声明，以方便按模块定义路由规则，如果使用ts可以搭配接口使用

```ts
import { IRouter } from 'sener';
const user: IRouter = {/* ... */};
const comment: IRouter = {/* ... */};

const router = new Router(user, comment);
```

## 路由映射

Router 中间件接受一个路由映射，路由映射的值可以为函数或者对象

### key

映射的key值为路由的url，url的格式如下：

```
[MetaInfo][Method:]<Url>
```

1. MetaInfo

路由元信息为可选部分，如果有的话会被解析成context中的meta属性，可供所有的中间件来进行处理

meta的格式为 [name1=value1&name2=value2]，其中value部分如果为空，则会被赋值为 true，如 `[a&b=2]` 会被解析为 {a: true, b: '2'}

以下是一个代码示例

```js
const router = new Router({
    '[a&b=2]/demo': ({ meta }) => {
        // meta: {a: true, b: '2'}
    },
});
```

注：当路由映射的值为对象时，key上不需要加入meta部分

2. Method 为路由方法，也是可选参数，默认值为get，需要使用`:`分割

```js
const router = new Router({
    '/aa': (ctx) => {},
    'get:/bb': (ctx) => {},
    'post:/cc': (ctx) => {},
    'delete:/dd': (ctx) => {},
});
```

3. Url就路由的path，该参数为必选

### value

路由映射的值可以使函数或对象，当为对象时，key中不可以加入meta部分，使用对象定义路由的好处是meta可以传入复杂类型的数据

```ts
// 当为函数时
export type IRouterHandler = (
    context: ISenerContext,
) => IPromiseMayBe<IHookReturn>; // IHookReturn 可以参考中间件章节

// 当为对象时
export interface IRouterHandlerData {
    handler: IRouterHandler;
    meta: IJson;
}
```

`IRouterHandler` 的参数是 context 对象，返回值即为中间件的返回值，处理逻辑与中间件一致

以下简单的例子

```js
const router = new Router({
    '/aa': (ctx) => {},
    '/bb': {
        meta: {},
        handler: (ctx) => {},
    },
});
```

## 私有路由

私有路由为一类特殊的路由，该种路由的入参与返回值与一般路有类似，区别是该种路由更类似于工具方法，不会被外部请求所访问，主要专门用于内部使用 `route` helper来调用

```js
const router = new Router({
    '#userCheck': (ctx) => {},
});
```

## router helper

router 中间件会注入以下三个 helper

```ts
interface IRouterHelper {
    meta: IJson;
    route(
        url: string, data?: Partial<ISenerContext>,
    ): IPromiseMayBe<IHookReturn>;
    index: ()=>number;
}
```

### meta

meta在前文中已经做过了介绍，主要是用来写入路由的元信息供自身或其他hook中使用

```js
const router = new Router({
    '/test': ({meta, index, route}) => {},
});
```

### route

route方法用来重定向到其他路由 或 调用其他请求拿到返回结果，该方法可以访问私有路由

```js
const router = new Router({
    '#test': () => {},
    'get:/test': () => {},

    '/route-test': ({route}) => {
        return route('/route-test')
    },
    '/route-test2': ({route}) => {
        const data = route('/route-test');
        // ... do something
        return {data};
    },
});
```

### index

index 方法会生成一个当前请求过程中递增的id，一般可以用来生成一些表示index的场景

```js
const router = new Router({
    '/test': ({index}) => {
        const data1 = {index: index()};
        const data2 = {index: index()};
        return success({data1, data2})
    },
});
```

## 工具方法

1. error & success
   
路由中可以使用 error 和 success 方法封装路由的返回值，定义如下

```ts
function error<T = null>(msg?: string, code?: number, data?: T): IMiddleWareResponseReturn<IRouterReturn<T>>
function success<T = any>(data?: T, msg?: string, extra?: {}): IMiddleWareResponseReturn<IRouterReturn<T>>
```

以下是一个简单的使用例子

```js
import {Router, error, success} from 'sener'
const router = new Router({
    '/test': () => {
        const data = something();
        if(data === null) return error();
        return success({data});
    },
});
```

2. responseXX 方法

路由handler中可以使用 responseXX 方法标识请求已经被响应，且返回值将响应结果注入 context 中。

```js
import {Router, error, success} from 'sener'
const router = new Router({
    '/test': ({send404}) => {
        const isLogin = something();
        if(!isLogin) {
            return responseXX();
        }
        return success({data});
    },
});
```

后续中间件遇到已被响应的标识之后会跳过hook，如果要处理已经标识过的请求，可以将 acceptResponded 值设置为 true。

```js
class CustomMiddle extends MiddleWare {
    acceptResponded = true;
    enter(ctx){
    }
}
```

3. markReturned 方法

如果第三方中间件已经自行使用 response 对象进行了发送请求响应，那么后续 sener 再次发送或者设置header会打印一个错误。

为了防止这种情况，可以使用 markReturned 方法表示请求已提前返回响应，不需要由sener统一发送响应。同时后续中间件遇到已被发送响应的标识之后会跳过hook，如果要处理已经标识过的请求，可以将 acceptReturned 值设置为 true。

```js
class CustomMiddle1 extends MiddleWare {

    enter({response, markReturned}){
        response.write('xxx');
        response.end();
        markReturned();
    }
}
class CustomMiddle2 extends MiddleWare {
    acceptReturned = true;
    enter({response, markReturned}){
    }
}
```