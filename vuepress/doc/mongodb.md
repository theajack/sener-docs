<!--
 * @Author: chenzhongsheng
 * @Date: 2023-05-14 14:49:08
 * @Description: Coding something
-->
# mongodb中间件

## 安装使用

mongodb中间件为独立中间件，需要单独安装使用

```
npm i sener-mongodb
```

```js
import { Mongo } from 'sener-mongodb';
new Mongo({
    // ...
});
```

## 基础使用

mongodb 中间件用于进行mongodb数据库的连接和数据操作

```js
import { Sener, Router } from 'sener';
import { Mongo } from 'sener-mongodb';

const router = new Router({
    '/demo': async ({ col, mongo }) => {
        await mongo.connect(); // 该步骤可以简写 见 配合router meta使用
        const user = col('user');
        const data = await user.find({name: 'tack'})
        await mongo.close(); // 该步骤可以简写 见 配合router meta使用
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

## 构造参数

mongodb 中间件依赖第三方包 [mongodb](https://www.npmjs.com/package/mongodb)，部分使用需要参考该包用法

```ts
interface IMongoProxyOptions<Models> {
    url: string; // 数据库连接url 请参考 mongodb
    dbName: string; // 数据库名称 请参考 mongodb
    models?: Models; // 自定义数据表Model 后续会介绍
    config?: MongoClientOptions; // new MongoClient 的其他配置，请参考 mongodb
}
```

## 自定义的context

如下声明所示，mongo中间件会在context中注如mongo和col属性

```ts
interface IMongoHelper<Cols extends IModels> {
  mongo: MongoProxy<Cols>;
  col: <T extends keyof (Cols) >(name: T)=> Instanceof<(Cols)[T]>;
}
```

### col

col 方法用于返回一个monogo collection封装之后的对象，后续会介绍该对象的使用

### mongo

以下是 MongoProxy 的声明

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
    switchDB(dbName: string): void; // 切换数据库
    connect(): Promise<void>;
    close(): Promise<void>;
    execute(func: () => Promise<any>): Promise<any>; // 执行一个函数，执行前后会自动connect和close
    col<Key extends keyof Models>(name: Key): Instanceof<Models[Key]>; // 获取一个 col，等价于context.col方法
}
```

## Col

Col 为mongodb封装的一层数据表抽象层，Col是一个类，有许多的封装好的操作表数据的方法，开发者定义的业务表可以继承自Col封装自己的业务逻辑

如果使用ts开发，Col支持传入ts声明来支持表数据的类型支持。

以下是Col的类型声明：

```ts
declare class MongoCol<T extends any = IJson> {
    name: string;
    col: Collection;
    mongoProxy: MongoProxy;
    constructor(name: string, mongoProxy?: MongoProxy);
    init(mongo: MongoProxy): void;
    add(data: T | T[]): Promise<mongodb.InsertManyResult<Document>> | Promise<mongodb.InsertOneResult<Document>>;
    remove(filter: IJson, all?: boolean): Promise<mongodb.DeleteResult>;
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
    slice({ index, filter, size, }: { // 从index位置取size个元素
        filter?: IJson;
        index: number;
        size?: number;
    }): Promise<T[]>;
    count(filter?: IJson): Promise<number>; // 从index位置取size个元素
}
```

## 关于 filter

filter 为过滤器，用于对数据集合进行删选。remove、update、find、page、slice、count方法中都会用到。

以下举几个简单例子，具体使用请参考 [MongoDB官方文档](https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/query-document/)

```js
const router = new Router({
    '/demo': async ({ col }) => {
        const user = col('user');

        await user.find({name: 'tack'}); // name=tack
        await user.count({age: {$gt: 18}}); // age>18
        await user.remove({age: {$not: {$gt: 18}}}); // age<=18
        await user.update({age: {$lt: 18}}, $set: { adult: false }, true); // set adult=false when age < 18
        await user.find({
            age: {$gt: 18},
            height: {$gt: 180},
        }); // age > 18 and height > 180
        await user.find({
            $or: [
                {age: {$gt: 18}},
                {height: {$gt: 180}},
            ]
        }); // age > 18 or height > 180

    },
});
```

## 配合router meta使用

每次调用 col 方法都前后都需要使用 connect打开数据库，调用完成之后都需要close关闭数据库。

这个操作会比较繁琐，可以通过的 meta.db来指定某些需要数据库操作路由进入和离开时自动打开和关闭数据库：

```js
const router = new Router({
    // 需要访问数据库的路由指定db=true即可
    '[db]/addComment': async ({ col }) => {
        const comment = col('comment');
        await comment.add({content: 'xxx'});
        return {data: {success: true}}
    },
});
```

## 自定义Col

可以通过继承 MongoCol 类来实现业务Col，内部封装数据库操作代码，对外暴露业务接口，如下：

```js
import { success } from 'sener';
import { MongoCol } from 'sener-mongodb';

export class User extends MongoCol {
    name = 'user';

    async regist (nickname: string, pwd: string, email: string) {
        const user = {};
        // do something ...
        await this.add(user);
        return success({}, '注册登录成功');
    }

    async login (nickname: string, pwd: string) {
        // ...do someting
        return success();
    }
}
```

使用时

```js
const router = new Router({
    '[db]/regist': async ({ col }) => {
        const user = col('user');
        await user.regist('xx', 'xx', 'xx');
        return {data: {success: true}}
    },
});
```

## ts类型声明

### 自定义Col类型声明

通过泛型传入数据类型之后，后续通过add、find、page等方法返回的数据都会有相应的类型支持

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
    // ...
}
```

### 指定Cols

```ts
import { Mongo } from 'sener-mongodb';

const Cols = {
    user: UserCol, // 自定义的UserCol
    comment: Comment, // 自定义的CommentCol
    // ...
};

const mongo = new Mongo({
    dbName: 'xxx',
    url: 'xxx',
    models: Cols,
});

declare module 'sener' {
    interface Model {
        models: typeof Cols;
    }
}
```