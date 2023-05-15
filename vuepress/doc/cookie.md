<!--
 * @Author: chenzhongsheng
 * @Date: 2023-05-14 14:48:02
 * @Description: Coding something
-->
# cookie 中间件

cookie 为内置中间件，用于在服务端获取或设置cookie

## 基础使用

```js
import {Sener, Cookie, Router} from 'sener'
const router = new Router({
    '/demo': ({ cookie }) => {
        const value = cookie.get('test');
        cookie.set('test', value+'_tail');
        return { data: {value} };
    },
});

new Sener({
  middlewares: [router, new Cookie()],
});
```

## 构造函数

Cookie 中间件支持传入一个cookieOptions，用来指定cookie的默认配置项

cookie.get 或 set 方法也可以传入这些配置项，get/set中传入的options会覆盖默认的option

以下为Cookie options的声明

```ts
interface ICookieOptions {
    value?: any;
    expire?: number;
    path?: string;
    domain?: string; // default: location.host
    secure?: boolean; // default: false
    sameSite?: ICookieSameSite; // default: Lax
    priority?: ICookiePriority; // default: Medium
    sameParty?: boolean; // default: false
}
```

```js
new Cookie({
    // ...
})
```

## cookie api

以下为 context.cookie 对象的类型声明

```ts
declare class CookieClient {
    private _cookie;
    request: IncomingMessage;
    response: IResponse;
    private _options;
    constructor(request: IncomingMessage, response: IResponse, options?: ICookieOptions);
    get(key: string): string;
    get<T extends string[]>(key: T): {
        [prop in keyof T]: string;
    };
    getResponseCookie(key: string): string;
    getResponseCookie<T extends string[]>(key: T): {
        [prop in keyof T]: string;
    };
    set(key: string | Record<string, ICookieValue>, value?: ICookieValue, options?: ICookieOptions): void;
    remove(key: string | string[]): void;
    expire: typeof countExpire;
}
declare function countExpire(value: string | number): number;
```

介绍几个主要的方法：

### get方法

get方法用于获取客户端的cookie

使用方式非常简单

```js
cookie.get(name);
// 获取多个cookie
cookie.get([name1, name2])
```

### set方法

set方法用于设置响应headers中的set-cookie字段，使用方式如下

1. 设置单个cookie

```js
cookie.set(name, value);
```

传入options，options参考 ICookieOptions

```js
cookie.set(name, value, {
    // ...
});
```


2. 设置多个cookie

```js
cookie.set({
    name: value,
    name2: value2
});
```

传入options，options参考 ICookieOptions

```js
cookie.set({
    name: value,
    name2: value2
}, {
    // ...
});
```

### remove方法

remove 方法用于删除cookie，使用方式如下

```js
cookie.remove(name);
// 删除多个
cookie.remove([name, name1]);
```

### expire方法

expire 方法用来计算cookie过期时间

```js
cookie.set(name, value, {
    expire: cookie.expire(1000)
})
```

当 expire 传入 number时，表示 n 毫秒之后过期

当传入 字符串时，可以根据末尾表示表示不同的时间，如 1m 表示一分钟

标识符有以下7中

 1. s: 秒
 2. m: 分钟
 3. h: 小时
 4. d: 天
 5. w: 星期
 6. M: 月
 7. y: 年

```js
cookie.set(name, value, {
    expire: cookie.expire('1d') // 1 天后过期
})
```

### getResponseCookie方法

getResponseCookie 用于获取设置的cookie，使用方式与 get 方法类似

```js
cookie.getResponseCookie(name);
// 获取多个cookie
cookie.getResponseCookie([name1, name2])
```



