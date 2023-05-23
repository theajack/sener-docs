<!--
 * @Author: chenzhongsheng
 * @Date: 2023-05-14 14:49:08
 * @Description: Coding something
-->
# log中间件

## 安装使用

log中间件为独立中间件，需要单独安装使用

```
npm i sener-log
```

```js
import { Log } from 'sener-log';
new Log();
```

## 基础使用

log 中间件用于进行服务端日志打印，保存文件为 .log 文件。

以下为上报一条日志的基本用法

```js
import { Sener, Router } from 'sener';
import { Log } from 'sener-log';

const router = new Router({
    '/demo': ({ logger }) => {
        logger.log('test log', {age: 18}, 'info');
        return { data: {success: true} };
    },
});

new Sener({
  middlewares: [router, new Log()],
});
```

除了使用logger context使用之外，也可以使用中间件来调用logger

```js
const log = new Log();

log.logger.log('test log', {age: 18}, 'info');
// log.logger 等价于 SenerContext.logger;
```

以下为一条基础的日志内容

```
[2023-03-07 01:46:09:313] type=log; msg=$$$message; payload={}; traceid=f8f9fa20-d192-405a-818e-0fc3653be13d; logid=93955e89-9e7d-40bb-b853-f653b2b892c3; duration=3; ua=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36; host=localhost:3001; timestamp=1678124769313;
```

特点：

1. 支持上报公共信息、自定义基础上报信息
2. 支持配置保存目录
3. 支持配置单文件最大记录数，超过最大记录数会启用新日志文件保存
4. 支持配置日志等级，按需打印日志
5. 支持通过traceid关联一次客户端请求过程中访问到的所有服务端内部请求。
6. 批量写日志文件，最大限度的节省性能开销。也支持主动保存日志。
7. 支持记录每个日志距离请求开始的时间消耗

## 构造参数

log 中间件具有如下构造参数

```ts
interface ILoggerOptions {
    dir?: string; // 日志文件的存储目录 默认为 'log', 即为 {Sener.Dir}/log
    useConsole?: boolean; // 是否写日志是使用console.log打印日志 默认为false 一般用于dev时
    maxRecords?: number; // 单文件最大的日志数量 默认值为10000
    level?: (()=>number)|number; // 配置日志级别 支持使用常量或配置一个函数动态获取 默认值为 -1 即所有日志都会被写入文件。配置常量之后也可以通过api来动态修改。
    interval?: number; // 设置检查保存日志的周期时间，单位为ms，默认为 5000
}
```

1. 关于level：每条日志都有一个level，默认值为5，当日志level值大于等于配置的level时，该日志才会被写入日志文件
2. 关于日志保存机制：logger 会定期检查日志队列，interval便是设置这个定时检查周期的，如果有需要保存的日志，就会批量一次性写入，已实现节省性能开销。也可以通过save方法主动强制保存。

## 完整日志信息

一条完整的日志基础信息如下：

```ts
interface ILogDBData {
  traceid: string; // 一次请求在服务端对应的id
  host: string; // 客户端host
  url: string; // 客户端url
  ua: string; // 客户端ua

  msg: string; // 日志消息
  payload: any; // 数据
  type: TLogType; // 日志类型
  level: number; // 日志级别

  duration: number; // 打印时距离请求开始的时间 单位为ms
  time: string; // 打印时的格式化时间 格式化到ms
  timestamp: number; // 打印时的时间戳
  logid: string; // 单条日志的唯一表示
}
```

## API

### log

写日志的api，声明如下

```ts
type TLogType = 'error' | 'log' | 'warn' | 'info';

interface IMessageData {
    msg?: string; //
    payload?: any;
    type?: TLogType;
    level?: number;
}
function log(msg: string | IMessageData, payload?: any, type?: TLogType): void;
```

使用字符串

```js
logger.log('xxx');
logger.log('xxx', {age: 18}, 'error');
```

使用object

```js
logger.log({
    msg: 'xxx',
    payload: {age: 18},
    level: 5, // level 默认值为5
});
```

### setLogLevel

动态设置日志级别

```js
logger.setLogLevel(10);
```

### save

save方法用于主动强制保存日志

```js
logger.save();
```

## traceid

traceid 会在请求到达服务端时通过获取或生成，然后写入baseInfo，当 headers['x-trace-id'] 不为空时，会生成一个 traceid。

后续在服务端内的所有内部请求产生的日志都会拥有一个相同 traceid，当响应被发送给客户端时，会将traceid作为 headers['x-trace-id'] 发送给客户端，可以通过 客户端获取到的 header traceid 查询一次请求产生的所有服务端日志

获取 traceid 的示例如下

```js
logger.traceid();
```

### setBaseInfo

setBaseInfo 方法用于设置日志的公共基础信息，声明如下

```ts
interface IBaseInfo {
    traceid?: string; // 请求的traceid
    host?: string; // 客户端host
    url?: string; // 客户端访问url
    ua?: string; // 客户端ua
}
function setBaseInfo (data: Partial<IBaseInfo> & IJson): void;
```

使用如下： 

```js
logger.setBaseInfo({appName: 'xxx'});
```

### newLogFile

newLogFile 用于主动生成一个新的日志文件写日志

```js
logger.newLogFile();
```

### count

count 方法用于获取当前在使用的日志文件中有多少条日志

```js
const n = logger.count();
```

### refreshDurationStart

refreshDurationStart 用于刷新日志计算时间消耗的起始时间。

```js
logger.refreshDurationStart();
```

### refreshTraceId

refreshTraceId 用于重新生成 traceid

```js
logger.refreshTraceId();
```