<!--
 * @Author: chenzhongsheng
 * @Date: 2023-05-14 14:48:34
 * @Description: Coding something
-->
# env中间件

env中间件用于请求过程中注入一些环境变量，环境变量可以是常量，也可以是根据上下文计算出来的值

## 基础使用




```js
import {Sener, Env, Cookie, Router, ISenerContext, IEnvOptions, IEnvMap} from 'sener'

const router = new Router({
    '/demo': ({ session }) => {
        const value = session.get('test');
        session.set('test', value+'_tail');
        return { data: {value} };
    },
});

const env: IEnvOptions = {
    uid ({ cookie }) {
        try {
            const payload = JSON.parse(base64ToString(cookie.get(TK_KEY)))[0];
            return payload.uid;
        } catch (e) {
            return '';
        }
    },
    token: 'xxxxxx'
};

declare module 'sener' {
    interface ISenerEnv extends IEnvMap<typeof env> {}
}


new Sener({
  middlewares: [router, new Cookie(), new Session()],
});
```



```js
import {Sener, Env, Session, Router} from 'sener'

const env = {
    uid ({ cookie }: IMiddleWareRequestData) {
        try {
            const payload = JSON.parse(base64ToString(cookie.get(TK_KEY)))[0];
            return payload.uid;
        } catch (e) {
            return '';
        }
    }
};

type IShiyiEnv = {
    [prop in keyof typeof env]: ReturnType<(typeof env)[prop]>;
}

declare module 'sener' {
    interface ISenerEnv extends IShiyiEnv {
    }
}


new Sener({
  middlewares: [router, new Cookie(), new Session()],
});
```