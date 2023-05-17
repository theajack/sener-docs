<!--
 * @Author: chenzhongsheng
 * @Date: 2023-05-14 14:48:30
 * @Description: Coding something
-->
# cors 中间件

cors中间件用来支持跨域请求

## 基础使用

```js
import {Sener, Cors, Router} from 'sener'
const router = new Router({
    // ...
});

new Sener({
    middlewares: [router, new Cors()],
});
```

注：如果使用类似 nginx 之类的反向代理服务器统一处理了跨域请求，则在sener服务中无需启用跨域功能

## 构造函数

Cors 中间件支持 ICorsOptions 来自定义跨域请求头，使用方式如下

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

与header的对应关系如下

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

以下为默认值

```js
{
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Credentials': 'true',
}
```

使用如下

```js
import {Cors} from 'sener';
new Cors({
    origin: 'http://shiyix.cn',
    headers: ['x-trace-id', 'x-uid'],
});
```