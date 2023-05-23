<!--
 * @Author: chenzhongsheng
 * @Date: 2023-05-14 14:49:08
 * @Description: Coding something
-->
# mysql中间件

## 安装使用

mysql中间件为独立中间件，需要单独安装使用

```
npm i sener-mysql
```

```js
import { Mysql } from 'sener-mysql';
new Mysql({
    // ...
});
```

## 基础使用

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

## 构造参数

mysql中间件依赖第三方包 [mysql](https://www.npmjs.com/package/mysql), 具体构造参数可以参考 `mysql.createConnection` 的参数

## 自定义的context

```ts
interface IMysqlHelper {
  querySql: (sql: string|QueryOptions) => Promise<{
    results: any;
    fields: FieldInfo[];
  }>;
  mysqlConn: Connection;
}
```

QueryOptions、FieldInfo、 Connection 具体使用请参考 [mysql](https://www.npmjs.com/package/mysql)

目前 mysql 仅提供一个简单地封装使用，有待进一步封装和优化。
