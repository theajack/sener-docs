<!--
  * @Author: chenzhongsheng
  * @Date: 2023-05-13 17:15:15
  * @Description: Coding something
-->

# middleware

Middleware is the core concept in Sener. Sener itself only provides a pipeline for parsing requests and processing responses. The specific functions are implemented by different middleware through hooks

```js
new Sener({
   middlewares: [mw1, mw2],
})
```

Note: middlewares can pass in null, and the null value will be ignored without reporting an error. In the following scenarios, a certain amount of code can be reduced

```js
new Sener({
   middlewares: [
     isDev? devMiddleware: null,
   ],
})
```

## concept

Sener middleware is an object that contains certain properties and hook functions. The following is a middleware interface

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

The following is a detailed introduction to attributes, where all attributes and methods are optional

1. name: middleware name
2. acceptOptions: Whether to accept the options method, the default is false, that is, the options method will not be passed into the hook
3. acceptResponded: Whether to accept the context that has been marked as responded (that is, the response has been constructed). The default value is false
4. acceptReturned: Whether to accept the context that has been marked as returned (that is, the response has been returned). The default value is false
5. helper: The hook of the generated tool will be executed after the middleware is used, and the sener will inject the result returned by the helper into the context
6. init: Initialize the hook, which will be executed first. It is generally recommended to insert some custom context or modify the context content.
7. enter: The hook for the request to enter. It is generally recommended to process the response in this middleware and return the response data.
8. leave: The hook that requests to leave. At this time, the request response has been sent to the client, so the return value of this hook is meaningless. It is generally used to do some state destruction operations, such as closing the database connection.

## onion model

The middleware has three hooks, and the execution order of the hooks follows the onion model, `parse request` -> `init` -> `enter` -> `return response` -> `leave`. As shown below:

![Sener-Hooks](https://shiyix.cn/images/sener-hooks.png)

The advantage of this model is that the middleware that enters first can be guaranteed to leave, and the execution priority of different components can be fixed

## hook logic

### helper

The helper is used to inject a static tool method or state into the context. The hook will be executed after the middleware is used, and it will only be executed this time. A json returned by the helper, the sener will inject the return value into each request in the context

###init

The init hook is the initialization hook of the middleware during the request process. It is generally used to modify the context or customize the context. It is generally not recommended to do operations related to request responses.

The return value type of init is Partial&lt;ISenerContext>

###enter

The enter hook is used to initialize middleware state or process request response.

enter The return value type is Partial&lt;ISenerContext>

###leave

The leave hook is executed after the request response is sent to the client, and is generally used to destroy some state of the middleware, such as disconnecting the database connection. The leave middleware does not need to have any return value

> Note: It is generally recommended to process the context related to the response in the enter hook, that is, the four attributes of data, statusCode, headers, and success, and wrap the tool method of calling the context. It is recommended to operate or customize other contexts in the init hook.

## Custom middleware

In addition to using official middleware, developers can also define their own middleware, there are two ways to define:

1. The first is the recommended way, inheriting the MiddleWare abstract class

```ts
import { MiddleWare } from 'sener';
export class CustomMiddle extends MiddleWare {
     // Declare hooks, etc.
}

const customMiddle = new CustomMiddle();
```

2. The second is to declare a json as middleware. If it is ts, you can get type hints through the IMiddleWare interface

```ts
import { IMiddleWare } from 'sener';
const customMiddle: IMiddleWare = {

}
```

The following is a simple middleware example for custom login status validation

```ts
import { MiddleWare, ISenerContext, IHookReturn } from 'sener';

export class LoginCheck extends MiddleWare {
     enter (ctx: ISenerContext): IHookReturn {
         if (!ctx.meta.tk) return;
         // Use the route meta attribute to determine whether login verification is required. This part needs to refer to the subsequent router middleware
         const result = checkLogin(); // to be implemented
         if (!result. success) {
             // Inject a failure response of type json into the context
             return ctx. responseJson(result. data);
         };
         // If the login is successful, inject uid
         const uid = result.data.uid;
         ctx.query.uid = uid;
         ctx.body.uid = uid;
     }
}
```

## Custom context

The following is an example of customizing context through middleware:

```ts
import { MiddleWare, ISenerContext, IHookReturn } from 'sener';

export class LoginCheck extends MiddleWare {
     init (ctx: ISenerContext): IHookReturn {
       ctx.uid = 'xxx'; // modify directly
       return {
         customArrtibute: 'xx', // modify by return value
         customHelper(){
           return ctx.url;
         },
       }
     }
}
```

## ts declaration

If you use typescript, you can provide more friendly type support by extending the ISenerContext interface

The ISenerContext interface can be extended using the following declaration

```ts
declare module 'sener-extend' {
   interface ISenerHelper {
     customArrtibute: {},
     customHelper: {},
   }
}
```