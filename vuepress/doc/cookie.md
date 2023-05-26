<!--
  * @Author: chenzhongsheng
  * @Date: 2023-05-14 14:48:02
  * @Description: Coding something
-->
# cookie middleware

Cookie is a built-in middleware used to get or set cookies on the server side

## Basic usage

```js
import {Sener, Cookie, Router} from 'sener'
const router = new Router({
     '/demo': ({ cookie }) => {
         const value = cookie. get('test');
         cookie.set('test', value+'_tail');
         return { data: {value} };
     },
});

new Sener({
   middlewares: [router, new Cookie()],
});
```

## Constructor

Cookie middleware supports passing in a cookieOptions to specify the default configuration items for cookies

The cookie.get or set method can also pass in these configuration items, and the options passed in get/set will override the default options

The following is the declaration of Cookie options

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
     //...
})
```

## cookie api

The following is the type declaration of the context.cookie object

```ts
declare class CookieClient {
     private_cookie;
     request: IncomingMessage;
     response: IResponse;
     private_options;
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

Introduce several main methods:

### get method

The get method is used to obtain the client's cookie

very easy to use

```js
cookie. get(name);
// get multiple cookies
cookie. get([name1, name2])
```

### set method

The set method is used to set the set-cookie field in the response headers, as follows

1. Set a single cookie

```js
cookie.set(name, value);
```

Pass in options, options refer to ICookieOptions

```js
cookie.set(name, value, {
     //...
});
```


2. Set multiple cookies

```js
cookie.set({
     name: value,
     name2: value2
});
```

Pass in options, options refer to ICookieOptions

```js
cookie.set({
     name: value,
     name2: value2
}, {
     //...
});
```

### remove method

The remove method is used to delete cookies, as follows

```js
cookie. remove(name);
// delete multiple
cookie. remove([name, name1]);
```

### expire method

The expire method is used to calculate the cookie expiration time

```js
cookie.set(name, value, {
     expire: cookie.expire(1000)
})
```

When expire passes in number, it means that it expires after n milliseconds

When a string is passed in, different times can be expressed according to the end, such as 1m means one minute

The identifier has the following 7

  1. s: seconds
  2. m: minutes
  3. h: hours
  4. d: days
  5. w: day of the week
  6. M: month
  7. y: year

```js
cookie.set(name, value, {
     expire: cookie.expire('1d') // expires in 1 day
})
```

### getResponseCookie method

getResponseCookie is used to get the set cookie, similar to the get method

```js
cookie. getResponseCookie(name);
// get multiple cookies
cookie. getResponseCookie([name1, name2])
```