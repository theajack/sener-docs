<!--
  * @Author: chenzhongsheng
  * @Date: 2023-05-14 14:48:34
  * @Description: Coding something
-->
# env middleware

The env middleware is used to inject some environment variables during the request process. The environment variables can be constants or values calculated according to the context.

## Basic usage

```js
import {Sener, Env, Router} from 'sener';

const router = new Router({
     '/demo': ({ env }) => {
         console.log(env.uid);
         return {};
     },
});

const env = {
     uid({ cookie }) {
         return cookie. get('COOKIE');
     },
     token: 'xxxxxx'
};

new Sener({
   middlewares: [router, new Env(env)],
});
```

The value of env can be of any type. When it is a function, it accepts an ISenerContext parameter, and the value will be calculated every request hook, so it can be used as an attribute.

## ts type declaration

```js
import {Sener, Env, Router, ISenerContext, IEnvMap} from 'sener';

const router = new Router({
     '/demo': ({ env }) => {
         console.log(env.uid);
         return {};
     },
});

const env = {
     uid ({ cookie }: ISenerContext) {
         return cookie. get('COOKIE');
     },
     token: 'xxxxxx'
};

declare module 'sener-extend' {
     interface ISenerEnv extends IEnvMap<typeof env> {}
}

new Sener({
   middlewares: [router, new Env(env)],
});
```