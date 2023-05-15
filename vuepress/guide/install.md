<!--
 * @Author: chenzhongsheng
 * @Date: 2022-10-30 02:42:04
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-13 17:04:03
-->

## 1. npm安装

```
npm i sener
```

<code-runner title='只使用sener'></code-runner>

```js
import { Sener } from 'sener';

new Sener({
  port: 9000,
  middlewares: [],
});
```

## 2. 安装使用中间件

```
npm i sener-json sener-static sener-form sener-config sener-log sener-mysql sener-mongodb sener-rpc
```

<code-runner title='中间件使用'></code-runner>

```js
// 内置中间件
import { 
  Sener, Router, Cookie, Session,
  Cors, Env, IpMonitor, Validator 
} from 'sener';
// 独立中间件
import { Json } from 'sener-json';
import { Static } from 'sener-static';
import { Form } from 'sener-form';
import { Config } from 'sener-config';
import { Log } from 'sener-log';
import { Mysql } from 'sener-mysql';
import { Mongo } from 'sener-mongodb';
import { RPC } from 'sener-rpc';

// ! 具体配置请参考对应的文档章节
new Sener({
  port: 9000,
  middlewares: [
    new Router({}), // 建议router放在middleware第一个
    new Cookie(), // cookie 需要在 session 之前
    new Session(),
    new Json(),
    new Static(),
    new Form(),
    new Config(),
    new Log(),
    new Mysql(),
    new Mongo(),
    new RPC(),
  ],
});
```