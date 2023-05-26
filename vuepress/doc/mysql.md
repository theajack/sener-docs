<!--
  * @Author: chenzhongsheng
  * @Date: 2023-05-14 14:49:08
  * @Description: Coding something
-->
# mysql middleware

## Install and use

The mysql middleware is an independent middleware and needs to be installed and used separately

```
npm i sener-mysql
```

```js
import { Mysql } from 'sener-mysql';
new Mysql({
     //...
});
```

## Basic usage

```js
import { Sener, Router } from 'sener';
import { Mysql } from 'sener-mysql';

const router = new Router({
     '/demo': async ({ querySql }) => {
         const {results, fields} = await querySql('select * from user')
         return { data: {success: true} };
     },
});

new Sener({
   middlewares: [router, new Mysql({
     host: 'localhost',
     user: 'me',
     password: 'secret',
     database: 'my_db'
   })],
});
```

## Construction parameters

The mysql middleware depends on the third-party package [mysql](https://www.npmjs.com/package/mysql), the specific construction parameters can refer to the parameters of `mysql.createConnection`

## Custom context

```ts
interface IMysqlHelper {
   querySql: (sql: string|QueryOptions) => Promise<{
     results: any;
     fields: FieldInfo[];
   }>;
   mysqlConn: Connection;
}
```

QueryOptions, FieldInfo, Connection Please refer to [mysql](https://www.npmjs.com/package/mysql) for specific usage

At present, mysql only provides a simple encapsulation and needs to be further encapsulated and optimized.