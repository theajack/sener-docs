<!--
  * @Author: chenzhongsheng
  * @Date: 2023-05-14 14:49:08
  * @Description: Coding something
-->
# static middleware

## Install and use

The static middleware is an independent middleware and needs to be installed and used separately

```
npm i sener-static
```

```js
import { Static } from 'sener-static';
new Static();
```

## Basic usage

The static middleware is used to establish static resource services and is used as follows:

```js
import { Sener } from 'sener';
import { Static } from 'sener-static';
new Sener({
     middlewares: [new Static()],
});
```

The above code will be in the public folder of the execution directory as the static resource root directory

For example: visit localhost:9000/image.jpg to access the ./public/image.jpg file

## Construction parameters

static middleware supports the following configurations:

```ts
interface IJsonOptions {
     dir?: string, // dir is used to set the directory of static resources, the default is 'public'
}
```

dir can be configured with a relative path, which means relative to `process.cwd()`, or an absolute path can be configured