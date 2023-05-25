<!--
 * @Author: chenzhongsheng
 * @Date: 2023-05-14 14:49:08
 * @Description: Coding something
-->
# static中间件

## 安装使用

static中间件为独立中间件，需要单独安装使用

```
npm i sener-static
```

```js
import { Static } from 'sener-static';
new Static();
```

## 基础使用

static中间件用于建立静态资源服务，使用方式如下：

```js
import { Sener } from 'sener';
import { Static } from 'sener-static';
new Sener({
    middlewares: [new Static()],
});
```

上面的代码会在执行目录的public文件夹作为静态资源根目录

如：访问 localhost:9000/image.jpg 就可以访问到 ./public/image.jpg 文件

## 构造参数

static中间件支持以下配置：

```ts
interface IJsonOptions {
    dir?: string, // dir 用于设置静态资源的目录，默认为 'public'
}
```

dir 可以配置相对路径，表示相对于 `process.cwd()`，也可以配置一个绝对路径