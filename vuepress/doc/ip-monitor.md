<!--
  * @Author: chenzhongsheng
  * @Date: 2023-05-14 14:48:50
  * @Description: Coding something
-->
# IP-Monitor middleware

## Basic usage

The IP-Monitor middleware is used to identify frequent visits of the same ip address, so as to control the risk of suspicious IP.

This middleware supports setting recognition mode, detection callback and processing callback, the basic usage is as follows:

```js
import {Sener, IpMonitor} from 'sener';

new Sener({
     middlewares: [new IpMonitor()],
});
```

IpMonitor accepts parameters of the following types:

```ts
interface IIpMonitorOptions {
     range?: number; // Indicates the time period for detecting access, the unit is s
     times?: number; // Indicates the number of times the same ip access was detected
     oncheck?: (ctx: ISenerContext, ) => boolean; // custom detection strategy
     handler?: (ctx: ISenerContext) => IHookReturn; // Customize the processing logic after the detection hit
}
```

## Configure risk control strategy

The default risk control strategy of IP-Monitor is that 30 visits within 10s are considered high-frequency visits, and all requests to change IP will directly return 404. Developers can adjust these two values ​​through parameters.

The following code indicates that when the same ip is visited 100 times within 30s, it is considered a high-frequency visit:

```js
import {IpMonitor} from 'sener';

new IpMonitor({
     range: 30,
     times: 100,
}),
```

## Custom risk control strategy

Developers can customize the risk control strategy through the oncheck attribute

```ts
import {IpMonitor} from 'sener';

new IpMonitor({
     oncheck({ip, url}: ISenerContext){
         // Here is just a simple example
         return url === '/demo' && ip === 'xx.xx.xx.xx';
     }
}),
```

Note: After enabling the oncheck parameter, the default strategy will be invalid, and the range and times parameters will also be invalid

## Custom processing strategy

The default strategy of IP-Monitor is to return 404 after detecting high-frequency access. Developers can customize the processing strategy through the handler parameter

```ts
import {IpMonitor} from 'sener';

new IpMonitor({
     handler({ip, send404}: ISenerContext): IHookReturn{
         saveRiskIP(ip); // Do some custom processing
         return send404('custom error message');
         // It can also return a normal return value. For details, please refer to the return of router middleware
         // return success({data: 'xxx'}) // success is a tool method, please refer to the previous article
     }
}),
```