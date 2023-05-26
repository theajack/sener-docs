<!--
  * @Author: chenzhongsheng
  * @Date: 2022-10-30 02:42:04
  * @Description: Coding something
  * @LastEditors: Please set LastEditors
  * @LastEditTime: 2023-05-13 17:04:03
-->

## 1. npm install

```
npm i sener
```

<code-runner title='Only use sener'></code-runner>

```js
import { Sener } from 'sener';

new Sener({
   port: 9000,
   middlewares: [],
});
```

## 2. Install and use middleware

```
npm i sener-json sener-static sener-form sener-config sener-log sener-mysql sener-mongodb sener-rpc
```

<code-runner title='Middleware usage'></code-runner>

```js
// built-in middleware
import {
   Sener, Router, Cookie, Session,
   Cors, Env, IpMonitor, Validator
} from 'sener';
// standalone middleware
import { Json } from 'sener-json';
import { Static } from 'sener-static';
import { Form } from 'sener-form';
import { Config } from 'sener-config';
import { Log } from 'sener-log';
import { Mysql } from 'sener-mysql';
import { Mongo } from 'sener-mongodb';
import { RPC } from 'sener-rpc';

// ! For specific configuration, please refer to the corresponding document chapter
new Sener({
   port: 9000,
   middlewares: [
     new Router({}), // It is recommended that the router be placed first in the middleware
     new Cookie(), // cookie needs to be before session
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