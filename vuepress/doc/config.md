<!--
  * @Author: chenzhongsheng
  * @Date: 2023-05-14 14:49:08
  * @Description: Coding something
-->
# config middleware

## Install and use

The config middleware is an independent middleware and needs to be installed and used separately

```
npm i sener-config
```

```js
import { Static } from 'sener-config';
new Static();
```

## Basic usage

The config middleware is used to configure some server-side parameters, saved as a json file, and supports dynamic modification to take effect immediately.

```js
import { Sener, Router } from 'sener';
import { Config } from 'sener-config';

const router = new Router({
     '/demo': ({ config }) => {
         console.log(config.level); // get level configuration
         return { data: {success: true} };
     },
});

new Sener({
   middlewares: [router, new Config()],
});
```

## Construction parameters

The config middleware supports the following configurations:

```ts
type IConfigChange = (data: {
   key: string, value: any, prev: any
}) => void;

interface IInitialConfigData {
     filename: string;
     data: Record<string, any>;
}
interface IConfigOptions {
     dir?: string, // The storage directory of the configuration file is 'config' by default, which is {Sener.Dir}/config
     format?: boolean, // Whether to format the configuration file, the default is true
     initial?: IInitialConfigData[], // initial configuration data
     onchange?: IConfigChange; // callback function for configuration data change
}
```

dir can be configured with a relative path, which means relative to `Sener.Dir`, or an absolute path can be configured

## Initial configuration data

The initial configuration data is a piece of data, the element contains filename and data, indicating a configuration file, and multiple means that multiple configuration files need to be used

```js

new Config({
     initial: [{
         filename: 'user', // user profile, stored as user.json
         data: {
             showImage: true, // Configure whether to display the avatar
             maxVisitors: 999, // Configure the maximum visible visitors
         }
     }, {
         filename: 'goods', // Product configuration file, stored as goods.json
         data: {
             maxPrice: 9999,
             //...
         }
     }]
});
```

Note: 

1. If the file in initial does not exist, the data will be created and written. If it exists, the data will be merged into the data in the original file. The merging rule is to only replace the undefined attribute in the original file without modifying it. Existing attributes, and will traverse the original data in depth.
2. After all the data in the initial file is merged with the data in the original file (if it exists), all attributes will be merged into a map, which is the config object of SenerContext. config[key] can be read and set to the latest json file data

## Custom SenerContext

The config middleware has only one Context attribute, which is config

You can use attributes to get or assign values directly, or you can listen to configuration file changes through the $onchange method

```js
const router = new Router({
     '/demo': ({ config }) => {
         console.log(config.level); // get level configuration
         config.level = 3;
         config. $onchange = (key, value, prev) => {
             console.log(key, value, prev);
         }
         return { data: {success: true} };
     },
});
```

## API

The config-middleware object has the following APIs that can be used directly

### data

data is equivalent to SenerContext.config

```js
const config = new Config();
config.data.$onchange(()=>{});
config.data.level = 1;
```

### writeConfig

writeConfig is equivalent to config.data.xxx = xxx;

```js
const config = new Config();
config.writeConfig('age', 1);
```

###onConfigChange

onConfigChange is equivalent to config.data.$onchange

```js
const config = new Config();
config.onConfigChange(()=>{});
```

## ts type declaration

If you want to declare the type of config data, you can use the following code to extend it:

```ts
declare module 'sener-extend' {
     interface IConfigData {
         level: number,
         age: number,
     }
}
```