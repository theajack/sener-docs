<!--
  * @Author: chenzhongsheng
  * @Date: 2023-05-14 14:48:30
  * @Description: Coding something
-->
# cors middleware

Cors middleware is used to support cross-domain requests

## Basic usage

```js
import {Sener, Cors, Router} from 'sener'
const router = new Router({
     //...
});

new Sener({
     middlewares: [router, new Cors()],
});
```

Note: If a reverse proxy server like nginx is used to uniformly process cross-domain requests, there is no need to enable cross-domain functions in the sener service

## Constructor

Cors middleware supports ICorsOptions to customize cross-domain request headers, and the usage is as follows

```ts
type IServeMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
interface ICorsOptions {
     origin?: string;
     methods?: IServeMethod[]|string;
     headers?: string[]|string;
     credentials?: boolean;
     exposeHeaders?: string[]|string;
     maxAge?: number;
}
```

The corresponding relationship with the header is as follows

```js
const Names = {
     origin: 'Access-Control-Allow-Origin',
     methods: 'Access-Control-Allow-Methods',
     headers: 'Access-Control-Allow-Headers',
     credentials: 'Access-Control-Allow-Credentials',
     exposeHeaders: 'Access-Control-Expose-Headers',
     maxAge: 'Access-Control-Max-Age',
};
```

The following is the default value

```js
{
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
     'Access-Control-Allow-Headers': '*',
     'Access-Control-Allow-Credentials': 'true',
}
```

Use as follows

```js
import {Cors} from 'sener';
new Cors({
     origin: 'http://shiyix.cn',
     headers: ['x-trace-id', 'x-uid'],
});
```