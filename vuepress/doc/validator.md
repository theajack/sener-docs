<!--
 * @Author: chenzhongsheng
 * @Date: 2023-05-14 14:49:05
 * @Description: Coding something
-->
# validator中间件

validator中间件用于对query和body数据的校验和转换，在ts中，也可以对数据类型进行声明

## vquery & vbody

validator 提供了vbody和vquery两个工具方法，可以在 context 中获取到。

类型声明如下：

```ts
type IValidTemplate = {
    [prop in string]: IValidFormat | [IValidFormat, IValidRule];
}

type IValidFunc = <
    D extends IValidTemplate = IValidTemplate
>(template: D) => ({
    [prop in keyof D]: IFormatMap[(D[prop] extends string ? D[prop]: D[prop][0])];
} & {
    [prop in string]: any;
});

interface IValidatorHelper {
    vquery: IValidFunc;
    vbody: IValidFunc;
}
```

vquery和vbody分别用于获取校验和转换后的query和body

## 基础使用

以vquery为例举一个例子：

```js
import { Sener, Router } from 'sener';

const router = new Router({
    '/demo': ({ vquery }) => {
        const query = vquery({
            nickname: [ 'string', 'required' ],
            age: [ 'number', 'required' ],
            weight: 'number', 
        });
        return { data: query };
    },
});

new Sener({
  middlewares: [router],
});
```

vquery 函数接受一个模板，键为query中需要的属性

值可以传入格式化类型(IValidFormat) 和 检验规则（IValidRule）

```ts
type IValidFormat = 'number' | 'string' | 'boolean' | 'any';
type IValidRule = 'required' | 'optional' | RegExp | ((v: any, formatValue: any) => boolean);
```

当值为数组是，第一位会被解析为 格式化类型，第二位会被解析为 检验规则

当值为字符串时，会被解析为 格式化类型，校验规则为默认值 optional

## 正则和函数校验

IValidRule 支持正则表达式和函数，当为函数式，参数第一个为原始值，第二个为格式化之后的值

```js
vquery({
    nickname: [ 'string', /[a-z]{8}/i ],
    age: [ 'number', (v, fv)=>fv >= 18 ],
    weight: 'number', 
});
```

当校验失败时，会返回一个404响应，可以通过 Sener的onerror参数进行拦截处理

当使用ts时，返回的query和body会根据template获得友好的类型支持




