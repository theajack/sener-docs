<!--
 * @Author: chenzhongsheng
 * @Date: 2023-05-14 14:49:08
 * @Description: Coding something
-->
# json中间件

## 安装使用

json中间件为独立中间件，需要单独安装使用

```
npm i sener-json
```

```js
import { Json } from 'sener-json';
new Json();
```

## 基础使用

```js
import { Sener, Router } from 'sener';
import { Json } from 'sener-json';

const router = new Router({
    '/demo': ({ write }) => {
        const { save, data } = write('user'); // 对 user.json 进行操作
        data.push({nickname: 'xxxx', age: 18});
        save(); // 保存修改的data
        return { data: {success: true} };
    },
});

new Sener({
  middlewares: [router, new Json()],
});
```

json中间件会往context上挂载四个方法，后面会详细介绍用法

```ts
interface IJsonHelper {
  file: <Model=any>(key: string) => File<Model>;
  write: <Model=any>(key: string) => IOprateReturn<Model>;
  read: <Model=any>(key: string) => Model[];
  readMap: <Model=any>(key: string) => IJson<Model>;
}
```

## 构造参数

json中间件支持以下配置：

```ts
interface IJsonOptions {
    dir?: string, // dir 用于设置json文件的保存目录，默认为 'json', 即为 {Sener.Dir}/json
    format?: boolean, // 是否格式化Json内容，默认为false
}
```

dir 可以配置相对路径，表示相对于 `Sener.Dir`，也可以配置一个绝对路径

## write 方法

write方法用户写文件，该方法会返回 `IOprateReturn`，其中包含数据和一些操作方法：

```ts
interface IOprateReturn<Model=any> {
    data: Model[]
    map: IJson<Model>;
    save: <T = Promise<boolean>, R extends boolean = false>(
        options?: {data?: Model[], map?: Model, imme?: R}
    ) => (R extends true ? boolean: T),
    clear: <T extends any>(data?: T) => T,
    id: () => number,
    index: () => number,
}
```

调用write方法会打开一个文件操作，会返回操作的数据和封装的操作方法

1. data：data表示数据的集合，是一个数组
2. map：map使用场景是保存键值映射表，这种场景使用map比data会更高效，map和data可以同时使用
3. save：save方法用于保存对 data和map的修改
4. clear：如果由于某些逻辑不需要保存文件，比如操作失败。则在返回之前需要调用clear方法清除一下文件操作话柄。当然不调用过一段时间之后该操作也会被自动回收。
5. id：id方法用于生成自增id以便使用在新数据中
6. index：index方法用于生成局部的自增id，每次调用write方法都会从0开始

以下做一个简单地演示

```js
const router = new Router({
    '/demo': ({ write }) => {
        const { data, map, save, clear, id, index } = write('user'); // 对 user.json 进行操作，如果没有文件会自动生成
        const user = {nickname: 'xxxx', id: id()}; // 加入自增id
        user.something = [{id: index()}, {id: index()}]; // 使用局部自增id
        map[user.id] = user.nickname;
        if(id > 10000){ // 自定义条件是否保存
            clear();
            return {data: {success: false}}
        }
        save(); // 保存修改的data和map
        return { data: {success: true} };
    },
});
```

## read 方法

read 方法用于获取json文件中的data集合

```js
const router = new Router({
    '/demo': ({ write }) => {
        const data = read('user');
        const user = data.find(item => item.id === '0001'); // 找到id是0001的用户
        return { data: {user} };
    },
});
```

## readMap 方法

readMap 方法与read方法类似，不过返回的是 map 映射表

```js
const router = new Router({
    '/demo': ({ write }) => {
        const map = readMap('user');
        const nickname = map['0001']; // 找到id是0001的用户名
        return { data: {nickname} };
    },
});
```

## file 方法

file方法用于返回封装的File对象，一般无需使用这个方法，具体API使用可以参考 [file.ts](https://github.com/theajack/sener/blob/master/packages/json/src/file.ts)

## 类型支持

以下四个方法都支持传一个泛型来指定，data集合的数据类型，以write为例

```js
interface User {
    nickname: string;
    age: number;
}

const router = new Router({
    '/demo': ({ write }) => {
        const { data, save } = write<User>('user'); // 对 user.json 进行操作
        // ...
        return { data: {success: true} };
    },
});
```
