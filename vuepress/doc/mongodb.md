<!--
  * @Author: chenzhongsheng
  * @Date: 2023-05-14 14:49:08
  * @Description: Coding something
-->
# mongodb middleware

## Install and use

The mongodb middleware is an independent middleware and needs to be installed and used separately

```
npm i sener-mongodb
```

```js
import { Mongo } from 'sener-mongodb';
new Mongo({
     //...
});
```

## Basic usage

mongodb middleware is used for connection and data operation of mongodb database

```js
import { Sener, Router } from 'sener';
import { Mongo } from 'sener-mongodb';

const router = new Router({
     '/demo': async ({ col, mongo }) => {
         await mongo.connect(); // This step can be abbreviated, see use with router meta
         const user = col('user');
         const data = await user. find({name: 'tack'})
         await mongo.close(); // This step can be abbreviated, see use with router meta
         return { data: {success: true} };
     },
});

new Sener({
   middlewares: [router, new Mongo({
     dbName: 'prod',
     url: 'xxx',
   })],
});
```

## Construction parameters

The mongodb middleware depends on the third-party package [mongodb](https://www.npmjs.com/package/mongodb), and some uses need to refer to the package usage

```ts
interface IMongoProxyOptions<Models> {
     url: string; // database connection url please refer to mongodb
     dbName: string; // database name, please refer to mongodb
     models?: Models; // custom data table Model will be introduced later
     config?: MongoClientOptions; // For other configurations of new MongoClient, please refer to mongodb
}
```

## Custom context

As shown in the following statement, the mongo middleware will annotate the mongo and col attributes in the context

```ts
interface IMongoHelper<Cols extends IModels> {
   mongo: MongoProxy<Cols>;
   col: <T extends keyof (Cols) >(name: T)=> Instanceof<(Cols)[T]>;
}
```

###col

The col method is used to return a monogo collection encapsulated object, and the use of this object will be introduced later

###mongo

Following is the declaration of MongoProxy

```ts
class MongoProxy<Models extends IModels = any> {
     client: MongoClient;
     dbName: string;
     db: Db;
     cols: {
         [key in keyof Models]: Instanceof<Models[key]>;
     };
     models: Models;
     connected: boolean;
     constructor({ url, models, dbName, config, }: IMongoProxyOptions<Models>);
     switchDB(dbName: string): void; // switch database
     connect(): Promise<void>;
     close(): Promise<void>;
     execute(func: () => Promise<any>): Promise<any>; // Execute a function, it will automatically connect and close before and after execution
     col<Key extends keyof Models>(name: Key): Instanceof<Models[Key]>; // Get a col, equivalent to the context.col method
}
```

## Col

Col is a data table abstraction layer encapsulated by mongodb. Col is a class with many encapsulated methods for manipulating table data. The business tables defined by developers can inherit from Col to encapsulate their own business logic.

If using ts development, Col supports passing in ts declarations to support the type support of table data.

Here is the type declaration for Col:

```ts
declare class MongoCol<T extends any = IJson> {
     name: string;
     col: Collection;
     mongoProxy: MongoProxy;
     constructor(name: string, mongoProxy?: MongoProxy);
     init(mongo: MongoProxy): void;
     add(data: T | T[]): Promise<mongodb. InsertManyResult<Document>> | Promise<mongodb. InsertOneResult<Document>>;
     remove(filter: IJson, all?: boolean): Promise<mongodb. DeleteResult>;
     update(filter: IJson, update: any, all?: boolean): Promise<mongodb.UpdateResult>;
     find(filter?: IJson): Promise<T[]>;
     page({ index, size, filter, needCount, }: {
         filter?: IJson;
         index: number;
         size?: number;
         needCount?: boolean;
     }): Promise<{
         data: T[];
         totalCount: number;
         totalPage: number;
         index: number;
     }>;
     slice({ index, filter, size, }: { // take size elements from index position
         filter?: IJson;
         index: number;
         size?: number;
     }): Promise<T[]>;
     count(filter?: IJson): Promise<number>; // take size elements from index position
}
```

## about filter

filter is a filter used to delete and select data collections. It will be used in remove, update, find, page, slice, and count methods.

Here are a few simple examples. For specific usage, please refer to [MongoDB Official Documentation](https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/query-document/)

```js
const router = new Router({
     '/demo': async ({ col }) => {
         const user = col('user');

         await user. find({name: 'tack'}); // name=tack
         await user.count({age: {$gt: 18}}); // age>18
         await user.remove({age: {$not: {$gt: 18}}}); // age<=18
         await user.update({age: {$lt: 18}}, $set: { adult: false }, true); // set adult=false when age < 18
         await user. find({
             age: {$gt: 18},
             height: {$gt: 180},
         }); // age > 18 and height > 180
         await user. find({
             $or: [
                 {age: {$gt: 18}},
                 {height: {$gt: 180}},
             ]
         }); // age > 18 or height > 180

     },
});
```

## Use with router meta

Every time you call the col method, you need to use connect to open the database before and after, and you need to close the database after the call is completed.

This operation will be cumbersome, and you can use meta.db to specify certain database operations that require routing to automatically open and close the database when entering and leaving:

```js
const router = new Router({
     // The route that needs to access the database can specify db=true
     '[db]/addComment': async ({ col }) => {
         const comment = col('comment');
         await comment. add({content: 'xxx'});
         return {data: {success: true}}
     },
});
```

## Custom Col

The business Col can be implemented by inheriting the MongoCol class, internally encapsulating the database operation code, and exposing the business interface externally, as follows:

```js
import { success } from 'sener';
import { MongoCol } from 'sener-mongodb';

export class User extends MongoCol {
     name = 'user';

     async regist (nickname: string, pwd: string, email: string) {
         const user = {};
         // do something...
         await this. add(user);
         return success({}, 'Successful registration and login');
     }

     async login (nickname: string, pwd: string) {
         // ...do something
         return success();
     }
}
```

when using it

```js
const router = new Router({
     '[db]/regist': async ({ col }) => {
         const user = col('user');
         await user.regist('xx', 'xx', 'xx');
         return {data: {success: true}}
     },
});
```

## ts type declaration

### Custom Col type declaration

After the data type is passed in through generics, the subsequent data returned through add, find, page and other methods will have corresponding type support

```ts
import { success } from 'sener';
import { MongoCol } from 'sener-mongodb';

interface IUserData {
     nickname: string;
     pwd: string;
     email: string;
}

export class User extends MongoCol<IUserData> {
     name = 'user';
     //...
}
```

### Specify Cols

```ts
import { Mongo } from 'sener-mongodb';

const Cols = {
     user: UserCol, // custom UserCol
     comment: Comment, // Custom CommentCol
     //...
};

const mongo = new Mongo({
     dbName: 'xxx',
     url: 'xxx',
     models: Cols,
});

declare module 'sener-extend' {
     interface Model {
         models: typeof Cols;
     }
}
```