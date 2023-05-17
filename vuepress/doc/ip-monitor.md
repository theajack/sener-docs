<!--
 * @Author: chenzhongsheng
 * @Date: 2023-05-14 14:48:50
 * @Description: Coding something
-->
# IP-Monitor中间件

## 基础使用

IP-Monitor中间件用于识别相同ip地址的频繁访问，从而对可疑IP进行风控。

该中间件支持设置识别模式、检测回调和处理回调，基本使用如下：

```js
import {Sener, IpMonitor} from 'sener';

new Sener({
    middlewares: [new IpMonitor()],
});
```

IpMonitor 接收如下类型的参数：

```ts
interface IIpMonitorOptions {
    range?: number; // 表示检测访问的时间周期 单位为s
    times?: number; // 表示检测到相同ip访问的次数
    oncheck?: (ctx: ISenerContext, ) => boolean; // 自定义检测策略
    handler?: (ctx: ISenerContext) => IHookReturn; // 自定义检测命中后的处理逻辑
}
```

## 配置风控策略

IP-Monitor 默认的风控策略是 10s 内访问 30 次被认为是高频访问，对改ip的所有请求直接返回404，开发者可以通过参数调整这两个数值。

以下代码表示当相同ip 30s内连续访问100次是被认为是高频访问：

```js
import {IpMonitor} from 'sener';

new IpMonitor({
    range: 30,
    times: 100,
}),
```

## 自定义风控策略

开发者可以通过 oncheck 属性自定义风控策略

```ts
import {IpMonitor} from 'sener';

new IpMonitor({
    oncheck({ip, url}: ISenerContext){
        // 此处仅仅演示一个简单的例子
        return url === '/demo' && ip === 'xx.xx.xx.xx';
    }
}),
```

注：开启oncheck参数之后，默认策略将失效，range和times参数也将失效

## 自定义处理策略

IP-Monitor 的默认策略是检测到高频访问之后就返回404，开发者可以通过handler参数自定义处理策略

```ts
import {IpMonitor} from 'sener';

new IpMonitor({
    handler({ip, send404}: ISenerContext): IHookReturn{
        saveRiskIP(ip); // 做一些自定义的处理
        return send404('自定义错误信息');
        // 也可以返回一个正常的返回值 具体可以参考router中间件的返回
        // return success({data: 'xxx'}) // success 为工具方法 可以参考前文
    }
}),
```
