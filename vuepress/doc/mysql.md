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
    sql: <Model extends Record<string, any> = {
      [prop: string]: string|number|boolean,
    }>(name: string)=>SQL<Model>; // Used to splice SQL statements
    _: typeof Cond; // Conditions for splicing sql statements
    table: <T extends keyof (Tables) >(name: T)=> Instanceof<(Tables)[T]>;
    querySql: (sql: string|QueryOptions) => Promise<{
      results: any;
      fields: FieldInfo[];
    }>;
    mysqlConn: Connection;
}

const Cond: {
    eq(v: any): string; // =
    notEq(v: any): string; // <> (!=)
    gt(v: any): string; // >
    lt(v: any): string; // <
    gte(v: any): string; // >=
    lte(v: any): string; // <=
    bt(v1: any, v2: any): string; // between
    in(vs: any[]): string; // in
    like(v: string): string; // like
    null(): string; // is null
    notNull(): string; // is not null
}
```

QueryOptions, FieldInfo, Connection Please refer to [mysql](https://www.npmjs.com/package/mysql) for specific usage

### sql

The sql method is used to quickly splice sql statements and supports chain calls. The simple usage method is as follows

```js
const router = new Router({
     '/demo': async ({ sql, _ }) => {
         const sqlStr = sql('user').select().where([
             { age: _.gt(18) }
         ]).sql;
         return { data: {sqlStr} };
     },
});
```

The following is the type declaration of the sql method

```ts
interface ISQLPage {
     index?: number;
     size?: number;
}
type ICondition<Model> = ({
     [prop in keyof Model]?: any;
})[];
interface IWhere<Model> {
     where?: ICondition<Model>;
     reverse?: boolean;
}
declare class SQL<Model extends Record<string, any> = {
     [prop: string]: string | number | boolean;
}, Key = keyof Model> {
     private tableName;
     private sql;
     constructor(tableName: string);
     private reset;
     select(...args: Key[]): this;
     selectDistinct(...args: Key[]): this;
     private_select;
     orderBy<T = Key>(...args: T[]): this;
     orderByDesc<T = Key>(...args: T[]): this;
     groupBy(name: Key): this;
     insert(data: Partial<Model>): this;
     update(data: Partial<Model>): this;
     delete(): this;
     where(conditions?: ICondition<Model>, reverse?: boolean): this;
     deleteAll(): this;
     count(): this;
     sum(name: Key): this;
     avg(name: Key): this;
     min(name: Key): this;
     max(name: Key): this;
     get v(): string;
     page({ index, size, }?: ISQLPage): this;
}
```

where method

```js
where([
   {age: 18, height: 170},
   {age: 10, height: 130},
   {age: 12, height: [130, 140]},
])
//The above statement means (age=18 and height=170) or (age=10 and height=130) or (age=12 and (height=130 or 140))

where([
   {age: 18, height: 170},
   {age: 10, height: 130},
   {age: 12, height: [130, 140]},
], true)
//The second parameter represents the logic of reversing and and or (the internal array is not reversed)
//The above means (age=18 or height=170) and (age=10 or height=130) and (age=12 or (height=130 or 140))
```

### table

Table is a data abstraction layer that encapsulates mysql data tables. Table is a class with many encapsulated methods for operating table data. Developers can use it directly, or they can inherit from Table to encapsulate their own business logic.

1. Use directly

```js
const router = new Router({
     '/demo': async ({ table }) => {
         const user = table('user');
         const result = await user.page({
           index: 3,
           size: 20,
         }).exec();
         return { data: {result} };
     },
});
```

The following is the type declaration of table

```ts
declare class Table<Model extends Record<string, any> = Record<string, any>> {
     sql: SQL;
     helper: IMysqlHelper$1;
     allKeys: string[];
     constructor(name: string, target: Mysql$1);
     find(...conds: ICondition<Model>): Promise<Model | null>;
     exist(...conds: ICondition<Model>): Promise<boolean>;
     filter(...conds: ICondition<Model>): Promise<Model[]>;
     page(data?: ISQLPage & IWhere<Model> & {
         orderBy?: {
             keys: (keyof Model)[];
             desc?: boolean;
         };
     }): Promise<Model[]>;
     count(where?: ICondition<Model>, reverse?: boolean): Promise<number>;
     update(data: Partial<Model>, conds: ICondition<Model>, reverse?: boolean): Promise<any>;
     add(data: Partial<Model>): Promise<{
         affectedRows: number;
         insertId: number;
     }>;
     exec<T = any>(sql: SQL): Promise<IQuerySqlResult$1>;
}
```

2. Inherit custom business logic

```ts
interface IUser {
     user_id: number,
     age: number,
     // ...
}
export class User extends Table<IUser> {
     async auth (ukey: string) {
       // todo
     }
     async login (data: any){
       // todo
     }
}
```

## ts type declaration

After the data type is passed in through generics, the parameters and return values of subsequent table methods will have corresponding type support.

Examples are as follows

```ts
interface IUser {
     user_id: number,
     age: number,
     // ...
}
class User extends Table<IUser> {
     async auth (ukey: string) {
       // todo
     }
     async login (data: any){
       // todo
     }
}
const tables = {
     user: User,
     // ...
};

type ITables = typeof tables;

declare module 'sener-extend' {
     interface Table {
         tables: ITables;
     }
}
```