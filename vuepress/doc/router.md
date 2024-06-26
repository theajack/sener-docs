<!--
  * @Author: chenzhongsheng
  * @Date: 2023-05-14 13:15:35
  * @Description: Coding something
-->
# Router middleware

## use

Router middleware is the most important and basic middleware, its function is to distribute routes

The following is a simple use

```js
import { Sener, Router } from 'sener';

const router = new Router({
     '/demo': ({ query }) => {
         // or: 'get:/demo': ({ query }) => { // get: prefix can be ignored
         query.message = 'from get';
         return { data: query };
         // Custom headers or statusCode
         // return { data: query, headers: {}, statusCode: 200 };
     },
     'post:/demo': async ({ body }) => {
         body. message = 'from post'
         return { data: body };
     },
});

new Sener({
   port: 9000,
   middlewares: [router],
});
```

You can also use json declaration to facilitate the definition of routing rules by module. If you use ts, you can use it with interfaces

```ts
import { IRouter } from 'sener';
const user: IRouter = {/* ... */};
const comment: IRouter = {/* ... */};

const router = new Router(user, comment);
```

## route map

The Router middleware accepts a route map, and the value of the route map can be a function or an object

### key

The key value of the mapping is the url of the route, and the format of the url is as follows:

```
[MetaInfo][Method:]<Url>
```

1. MetaInfo

The routing meta information is an optional part, if any, it will be parsed into the meta attribute in the context, which can be processed by all middleware

The format of meta is [name1=value1&name2=value2], if the value part is empty, it will be assigned a value of true, such as `[a&b=2]` will be parsed as {a: true, b: '2'}

Here is a code example

```js
const router = new Router({
     '[a&b=2]/demo': ({ meta }) => {
         // meta: {a: true, b: '2'}
     },
});
```

Note: When the value of the routing map is an object, the meta part does not need to be added to the key

2. Method is a routing method, and it is also an optional parameter. The default value is get, which needs to be separated by `:`

```js
const router = new Router({
     '/aa': (ctx) => {},
     'get:/bb': (ctx) => {},
     'post:/cc': (ctx) => {},
     'delete:/dd': (ctx) => {},
});
```

3. Url is the path of the route, this parameter is mandatory

### value

The value of the routing map can be a function or an object. When it is an object, the meta part cannot be added to the key. The advantage of using an object to define a route is that meta can pass in complex types of data

```ts
// when it is a function
export type IRouterHandler = (
     context: ISenerContext,
) => IPromiseMayBe<IHookReturn>; // IHookReturn can refer to the middleware chapter

// when it is an object
export interface IRouterHandlerData {
     handler: IRouterHandler;
     meta?: IJson;
     alias?: string[]; // Route alias, used to point different URLs to the same route
}
```

The parameter of `IRouterHandler` is the context object, and the return value is the return value of the middleware, and the processing logic is consistent with that of the middleware

The following simple example

```js
const router = new Router({
     '/aa': (ctx) => {},
     '/bb': {
         meta: {},
         alias: ['/bb1', '/bb2'], // bb1 and bb2 will also point to the current route
         handler: (ctx) => {},
     },
});
```

## Private routing

Private routing is a special type of routing. The entry and return value of this type of routing is similar to that of general routing. The difference is that this type of routing is more similar to tool methods and will not be accessed by external requests. It is mainly used for internal use `route ` helper to call

```js
const router = new Router({
     '#userCheck': (ctx) => {},
});
```

## Fuzzy matching

Router middleware supports fuzzy matching, that is, it can match a type of route and then distribute it according to parameters in the handler


```js
const router = new Router({
     '/api/:userId': ({params}) => {
         return {data: params.userId};
     },
     // Regular conditions
     '/api2/:userId(\d+)': ({params}) => {
         // followed by parentheses indicates that the parameters need to satisfy the regular expression, otherwise the routing will report an error
         return {data: params.userId};
     },
     // Prefixed with # to represent numbers
     '/api3/:#userId': ({params}) => {},
     //With ! prefix indicates Boolean type
     '/api4/:!isTrue': ({params}) => {},
});
```


## Reuse route prefix

Router middleware supports reusing route prefixes, that is, it can extract the prefixes of a type of route

Use the createRoute method to create a set of routes with the same prefix. The use of sub-routes is consistent with the complete route. It supports method prefixes, private routes, meta, fuzzy matching, etc. The usage method is as follows

```js
import { createRoute } from 'sener';
const router = new Router({
     ...createRoute('/api/user', {
         '/info': ()=>{
             // ...
         },
         'post:/update': ()=>{
             // ...
         },
         // ...
     })
});
```

## router helper

The router middleware will inject the following helpers

```ts
interface IRouterHelper {
     meta: IJson; // Get routing meta information
     params: IJson; // Get parameters in route fuzzy matching
     index: ()=>number;
     route<T extends IHookReturn = IHookReturn>(
         url: string, data?: Partial<ISenerContext>,
     ): IPromiseMayBe<T>; // Call other routes and return routing results, generally used to reuse routing logic
     redirect: (url: string, query?: IJson, header?: IJson) => void, // Route redirection (302)
}
```

### meta

Meta has been introduced in the previous article. The meta in the helper is used to obtain the meta information of the current route.

```js
const router = new Router({
     '[db]/test': ({meta}) => {
         return {data: meta};
     },
});
```

### params

params has been introduced in the previous article. The params in the helper are used to obtain the parameters of the current route.

```js
const router = new Router({
     '/test/:id': ({params}) => {
         return {data: params};
     },
});
```

### route

The route method is used to call other routes to get the returned results. This method can access private routes.

```js
const router = new Router({
     '#test': () => {},
     'get:/test': () => {},

     '/route-test': ({route}) => {
         return route('/route-test')
     },
     '/route-test2': ({route}) => {
         const data = route('/route-test');
         // ...do something
         return {data};
     },
});
```

### redirect

The redirect method is used for route redirection.

```js
const router = new Router({
     '/test1': () => {return {data: 'test1'}},
     '/test2': ({redirect}) => {
         return redirect('/test1')
     },
});
```

### index

The index method will generate an id that is incremented during the current request process, which can generally be used to generate some scenarios that represent the index

```js
const router = new Router({
     '/test': ({index}) => {
         const data1 = {index: index()};
         const data2 = {index: index()};
         return success({data1, data2})
     },
});
```

## Tool method

1. error & success
   
Routing can use the error and success methods to encapsulate the return value of the route, defined as follows

```ts
function error<T = null>(msg?: string, code?: number, data?: T): IMiddleWareResponseReturn<IRouterReturn<T>>
function success<T = any>(data?: T, msg?: string, extra?: {}): IMiddleWareResponseReturn<IRouterReturn<T>>
```

The following is a simple usage example

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

2. The responseXX method

The responseXX method can be used in the routing handler to identify that the request has been responded, and the return value will inject the response result into the context.

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

Subsequent middleware will skip the hook after encountering an identified response. If you want to process an identified request, you can set the acceptResponded value to true.

```js
class CustomMiddle extends MiddleWare {
     acceptResponded = true;
     enter(ctx){
     }
}
```

3. markReturned method

If the third-party middleware has already used the response object to send the request response, then the subsequent sender will send it again or set the header to print an error.

In order to prevent this situation, you can use the markReturned method to indicate that the request has returned a response in advance, and the response does not need to be sent uniformly by the sener. At the same time, the subsequent middleware will skip the hook after encountering the identification of the response that has been sent. If you want to process the identified request, you can set the value of acceptReturned to true.

```js
class CustomMiddle1 extends MiddleWare {

     enter({response, markReturned}){
         response.write('xxx');
         response. end();
         markReturned();
     }
}
class CustomMiddle2 extends MiddleWare {
     acceptReturned = true;
     enter({response, markReturned}){
     }
}
```