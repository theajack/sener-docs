<!--
 * @Author: chenzhongsheng
 * @Date: 2023-05-14 14:49:08
 * @Description: Coding something
-->
# form中间件

## 安装使用

form中间件为独立中间件，需要单独安装使用

```
npm i sener-form
```

```js
import { Form } from 'sener-form';
new Form();
```

## 基础使用

form中间件用于对 form-data类型的数据进行处理，主要用于文件上传

```js
import { Sener, Router } from 'sener';
import { Form } from 'sener-form';

const router = new Router({
    '/demo': ({ formData, files }) => {
        // formData 用于获取数据，map类型
        // files 用于获取文件对象，map类型
        return { data: {success: true} };
    },
});

new Sener({
  middlewares: [router, new Form()],
});
```

## 构造参数

form 中间件支持以下配置：

```ts
interface IJsonOptions {
    dir?: string, // dir 用于设置文件上传文件的保存目录，默认为 './public/upload' 没有会自行创建
}
```

## form context

form 中间件指定了两个 context

```ts
interface ISenerHelper {
    files: Files; // files 表示获取到的 formData 中的文件map对象
    formData: IJson; // formData 表示 formData 中的其他数据
}
```

以下是一个简单示例：

假如客户端上传的body是一个如下的formdata

```
FormData({
    key: 'test', // 模拟一个普通的值
    img: File, // 模拟上传一张图片
})
```

```js
new Router({
    'post:/upload': ({ formData, files }) => {
        // formData => {key: 'test'}
        // files => {img: SenerFile}
        files = transformFilePath(files); // 将本地目录转换成公网url
        return success({ formData, files }, '文件上传成功');
    }
});
```

以下为 SenerFile 对象的结构

```ts
interface SenerFile {
    size: number; // 文件大小 单位为 byte
    filepath: string; // 文件的本地目录：如 /public/upload/2023_05/xxxx
    mimetype: string; // 文件 mimetype 如 image/png
    mtime: string; // 文件 mtime "2023-05-21T10:21:32.060Z"
    newFilename: string; // 新文件名
    originalFilename: string; // 原始文件名
}
```
