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

```js
import { Sener, Router } from 'sener';
import { Mongo } from 'sener-mongodb';

const router = new Router({
    '/demo': async ({ col }) => {
        const user = col('user');
        const data = await user.find({name: 'tack'})
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
    update(filter: any, update: any, all?: boolean): Promise<mongodb.UpdateResult>;
    find(filter?: {}): Promise<T[]>;
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
    slice({ index, filter, size, }: {
        filter?: IJson;
        index: number;
        size?: number;
    }): Promise<T[]>;
    count(filter?: {}): Promise<number>;
}
```



## 配合router meta使用