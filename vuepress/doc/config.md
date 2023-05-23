<!--
 * @Author: chenzhongsheng
 * @Date: 2023-05-14 14:49:08
 * @Description: Coding something
-->
# config中间件

## 安装使用

config中间件为独立中间件，需要单独安装使用

```
npm i sener-config
```

```js
import { Static } from 'sener-config';
new Static();
```

## 基础使用

config 中间件用于进行一些服务端的参数配置，保存形式为json文件，支持动态修改立即生效。

```js
import { Sener, Router } from 'sener';
import { Config } from 'sener-config';

const router = new Router({
    '/demo': ({ config }) => {
        console.log(config.level); // 获取level配置
        return { data: {success: true} };
    },
});

new Sener({
  middlewares: [router, new Config()],
});
```

## 构造参数

config 中间件支持以下配置：

```ts
type IConfigChange = (data: {
  key: string, value: any, prev: any
}) => void;

interface IInitialConfigData {
    filename: string;
    data: Record<string, any>;
}
interface IConfigOptions {
    dir?: string, // 配置文件的存储目录 默认为 'config', 即为 {Sener.Dir}/config
    format?: boolean, // 是否格式化配置文件，默认为true
    initial?: IInitialConfigData[], // 初始配置数据
    onchange?: IConfigChange; // 配置数据改变的回调函数
}
```

dir 可以配置相对路径，表示相对于 `Sener.Dir`，也可以配置一个绝对路径

## 初始配置数据

初始配置数据为一个数据，元素包含有filename和data，表示一个配置文件，多个即表示需要使用多个配置文件

```js

new Config({
    initial: [{
        filename: 'user', // 用户配置文件，存储为 user.json
        data: {
            showImage: true, // 配置是否展示头像
            maxVisitors: 999, // 配置最大可见访客
        }
    }, {
        filename: 'goods', // 商品配置文件，存储为 goods.json
        data: {
            maxPrice: 9999,
            // ...
        }
    }]
});
```

注: 

1. 如果initial中的文件不存在，则会创建并写入数据，如果存在，则会将数据合并到原文件中的数据中，合并规则为只对原文件中 undefined 属性进行替换，不会修改已存在的属性，且会深度遍历原数据。
2. initial 中的所有data与原文件中的data（如存在）合并之后，会将所有属性归并在一个map中，即为 SenerContext的config对象，config[key] 可以读取和设置到最新的json文件数据

## 自定义的SenerContext

config 中间件只有一个Context属性，即为 config

可以使用属性直接获取或者赋值，也可以通过 $onchange 方法监听配置文件的变更

```js
const router = new Router({
    '/demo': ({ config }) => {
        console.log(config.level); // 获取level配置
        config.level = 3;
        config.$onchange = (key, value, prev) => {
            console.log(key, value, prev);
        }
        return { data: {success: true} };
    },
});
```

## API

config-middleware 对象上具有如下api可以直接使用

### data

data 等价于 SenerContext.config

```js
const config = new Config();
config.data.$onchange(()=>{});
config.data.level = 1;
```

### writeConfig

writeConfig 等价于 config.data.xxx = xxx;

```js
const config = new Config();
config.writeConfig('age', 1);
```

### onConfigChange

onConfigChange 等价于 config.data.$onchange

```js
const config = new Config();
config.onConfigChange(()=>{});
```

## ts类型声明

如果要对 config 的数据进行类型声明，可以使用如下代码进行扩展：

```ts
declare module 'sener' {
    interface IConfigData {
        level: number,
        age: number,
    }
}
```
