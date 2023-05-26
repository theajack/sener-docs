# session middleware

The session middleware user obtains and sets the session. This middleware depends on the cookie middleware, because it needs to rely on the cookie to represent the customer's identity. When referencing, the cookie middleware should be referenced before the seesion

## Basic usage

```js
import {Sener, Cookie, Session, Router} from 'sener'
const router = new Router({
     '/demo': ({ session }) => {
         const value = session. get('test');
         session.set('test', value+'_tail');
         return { data: {value} };
     },
});

new Sener({
   middlewares: [router, new Cookie(), new Session()],
});
```

## Constructor

The Session middleware constructor supports passing in an options

```ts
interface ISessionClientOptions {
     idGenerator?: ()=>string;
     storeDays?: number;
}
```

idGenerator is used to return a unique identifier, used as SessionId

storeDays is used to specify the maximum number of days for the session to be cached. Files exceeding this number of days will be cleaned up regularly to ensure that the server-side session cache file will not expand infinitely

## session api

The following is the type declaration of the context.session object

```ts
declare class SessionClient {
     static baseDir: string;
     static idGenerator: typeof generateSessionId;
     static_timer: any;
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


Introduce several main methods:

### get method

The get method is used to get the session

very easy to use

```js
session. get(name);
// Get multiple sessions
session. get([name1, name2])
```

### set method

The set method is used to set the session

1. Set up a single session

```js
session.set(name, value);
```

2. Set multiple cookies

```js
session.set({
     name: value,
     name2: value2
});
```

### remove method

The remove method is used to delete the session, which is used as follows

```js
session. remove(name);
// delete multiple
session. remove([name, name1]);
```

### expire method

The expire method is used to calculate the session expiration time, the usage is consistent with the cookie.expire method, please refer to the cookie section

### isExpired method

The isExpired method is used to determine whether a session value has expired

```js
const v = session. get(name);
session.isExpired(v);
```