<!--
  * @Author: chenzhongsheng
  * @Date: 2023-05-14 14:49:08
  * @Description: Coding something
-->
# json middleware

## Install and use

The json middleware is an independent middleware and needs to be installed and used separately

```
npm i sener-json
```

```js
import { Json } from 'sener-json';
new Json();
```

## Basic usage

```js
import { Sener, Router } from 'sener';
import { Json } from 'sener-json';

const router = new Router({
     '/demo': ({ write }) => {
         const { save, data } = write('user'); // operate on user.json
         data.push({nickname: 'xxxx', age: 18});
         save(); // save the modified data
         return { data: {success: true} };
     },
});

new Sener({
   middlewares: [router, new Json()],
});
```

The json middleware will mount four methods on the context, and the usage will be introduced in detail later

```ts
interface IJsonHelper {
   file: <Model=any>(key: string) => File<Model>;
   write: <Model=any>(key: string) => IOprateReturn<Model>;
   read: <Model=any>(key: string) => Model[];
   readMap: <Model=any>(key: string) => IJson<Model>;
}
```

## Construction parameters

The json middleware supports the following configurations:

```ts
interface IJsonOptions {
     dir?: string, // dir is used to set the saving directory of the json file, the default is 'json', which is {Sener.Dir}/json
     format?: boolean, // Whether to format the Json content, the default is false
}
```

dir can be configured with a relative path, which means relative to `Sener.Dir`, or an absolute path can be configured

## write method

The write method user writes a file, this method will return `IOprateReturn`, which contains data and some operation methods:

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

Calling the write method will open a file operation, and will return the data of the operation and the encapsulated operation method

1. data: data represents a collection of data, which is an array
2. map: The usage scenario of map is to save the key-value mapping table. In this scenario, using map is more efficient than data, and map and data can be used at the same time
3. save: The save method is used to save the modification of data and map
4. clear: If the file does not need to be saved due to some logic, such as an operation failure. Then you need to call the clear method to clear the file operation handle before returning. Of course, the operation will be automatically recycled after not being called for a period of time.
5. id: The id method is used to generate an auto-increment id for use in new data
6. index: The index method is used to generate a local self-incrementing id, and each call to the write method will start from 0

The following is a simple demonstration

```js
const router = new Router({
     '/demo': ({ write }) => {
         const { data, map, save, clear, id, index } = write('user'); // operate on user.json, if there is no file, it will be automatically generated
         const user = {nickname: 'xxxx', id: id()}; // add auto-increment id
         user.something = [{id: index()}, {id: index()}]; // Use local auto-increment id
         map[user.id] = user.nickname;
         if(id > 10000){ // Whether to save custom conditions
             clear();
             return {data: {success: false}}
         }
         save(); // Save the modified data and map
         return { data: {success: true} };
     },
});
```

## read method

The read method is used to obtain the data collection in the json file

```js
const router = new Router({
     '/demo': ({ write }) => {
         const data = read('user');
         const user = data.find(item => item.id === '0001'); // find the user whose id is 0001
         return { data: {user} };
     },
});
```

## readMap method

The readMap method is similar to the read method, but returns a map mapping table

```js
const router = new Router({
     '/demo': ({ write }) => {
         const map = readMap('user');
         const nickname = map['0001']; // find the username whose id is 0001
         return { data: {nickname} };
     },
});
```

## file method

The file method is used to return the encapsulated File object. Generally, there is no need to use this method. For specific API usage, please refer to [file.ts](https://github.com/theajack/sener/blob/master/packages/json/src/file .ts)

## Type support

The following four methods all support passing a generic to specify the data type of the data collection, taking write as an example

```js
interface User {
     nickname: string;
     age: number;
}

const router = new Router({
     '/demo': ({ write }) => {
         const { data, save } = write<User>('user'); // operate on user.json
         //...
         return { data: {success: true} };
     },
});
```