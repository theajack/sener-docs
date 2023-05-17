<!--
 * @Author: chenzhongsheng
 * @Date: 2023-05-14 14:48:34
 * @Description: Coding something
-->
# env中间件

env中间件用于请求过程中注入一些环境变量，环境变量可以是常量，也可以是根据上下文计算出来的值。

## 基础使用

```js
import {Sener, Env, Router} from 'sener';

const router = new Router({
    '/demo': ({ env }) => {
        console.log(env.uid);
        return {};
    },
});

const env = {
    uid ({ cookie }) {
        return cookie.get('COOKIE');
    },
    token: 'xxxxxx'
};

new Sener({
  middlewares: [router, new Env(env)],
});
```

env 的值可以是任意类型，当为函数时，接受一个 ISenerContext 参数，会在每次request hook时将值计算好，所以使用时当做属性就可以。

## ts类型声明

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
        return cookie.get('COOKIE');
    },
    token: 'xxxxxx'
};

declare module 'sener' {
    interface ISenerEnv extends IEnvMap<typeof env> {}
}

new Sener({
  middlewares: [router, new Env(env)],
});
```