# session 中间件

session中间件用户获取和设置session，该中间件依赖于cookie中间件，因为需要依赖cookie表示客户身份，引用时入住cookie中间件要在seesion之前引用

## 基础使用

```js
import {Sener, Cookie, Session, Router} from 'sener'
const router = new Router({
    '/demo': ({ session }) => {
        const value = session.get('test');
        session.set('test', value+'_tail');
        return { data: {value} };
    },
});

new Sener({
  middlewares: [router, new Cookie(), new Session()],
});
```

## 构造函数

Session 中间件构造函数支持传入一个 options

```ts
interface ISessionClientOptions {
    idGenerator?: ()=>string;
    storeDays?: number;
}
```

idGenerator 用于返回一个唯一性标识，作为 SessionId 使用

storeDays 用来指定session最大缓存天数，超过这个天数的文件会被定期清理，已保证服务端session缓存文件不会无限膨胀

## session api

以下为 context.session 对象的类型声明

```ts
declare class SessionClient {
    static baseDir: string;
    static idGenerator: typeof generateSessionId;
    static _timer: any;
    static init({ idGenerator, storeDays }: ISessionClientOptions): void;
    sessionId: string;
    filePath: string;
    Expired: symbol;
    constructor(cookie: CookieClient);
    get(key: string): any;
    get<T extends string[]>(key: T): {
        [prop in keyof T]: any;
    };
    set(key: string | Record<string, null | any>, value?: null | any | number, expire?: number): void;
    remove(key: string | string[]): void;
    isExpired(value: any): boolean;
    expire: typeof countExpire;
}
```


介绍几个主要的方法：

### get方法

get方法用于获取session

使用方式非常简单

```js
session.get(name);
// 获取多个session
session.get([name1, name2])
```

### set方法

set方法用于设置session

1. 设置单个session

```js
session.set(name, value);
```

2. 设置多个cookie

```js
session.set({
    name: value,
    name2: value2
});
```

### remove方法

remove 方法用于删除session，使用方式如下

```js
session.remove(name);
// 删除多个
session.remove([name, name1]);
```

### expire 方法

expire 方法用来计算session过期时间，用法与cookie.expire 方法一致，请参考 cookie部分

### isExpired 方法

isExpired 方法用于判断某个session值是否过期

```js
const v = session.get(name);
session.isExpired(v);
```
