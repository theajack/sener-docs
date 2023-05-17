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

json中间件支持以下配置：

```ts
interface IJsonOptions {
    dir?: string, // dir 用于设置文件上传文件的保存目录，默认为 './public/upload' 没有会自行创建
}
```

