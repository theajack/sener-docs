<!--
  * @Author: chenzhongsheng
  * @Date: 2023-05-14 14:49:05
  * @Description: Coding something
-->
# validator middleware

The validator middleware is used to check and convert query and body data. In ts, the data type can also be declared

## vquery & vbody

validator provides two tool methods, vbody and vquery, which can be obtained in context.

The type declaration is as follows:

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

vquery and vbody are used to obtain the query and body after the checksum conversion

## Basic usage

Take vquery as an example:

```js
import { Sener, Router } from 'sener';

const router = new Router({
     '/demo': ({ vquery }) => {
         const query = vquery({
             nickname: ['string', 'required'],
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

The vquery function accepts a template whose keys are the attributes required in the query

Values can be passed in format type (IValidFormat) and validation rule (IValidRule)

```ts
type IValidFormat = 'number' | 'string' | 'boolean' | 'any';
type IValidRule = 'required' | 'optional' | RegExp | ((v: any, formatValue: any) => boolean);
```

When the value is an array, the first digit will be parsed as the format type, and the second digit will be parsed as the inspection rule

When the value is a string, it will be parsed as a format type, and the validation rule is the default value optional

## Regex and function validation

IValidRule supports regular expressions and functions. When it is functional, the first parameter is the original value, and the second is the formatted value

```js
vquery({
     nickname: [ 'string', /[a-z]{8}/i ],
     age: [ 'number', (v, fv)=>fv >= 18 ],
     weight: 'number',
});
```

When the verification fails, a 404 response will be returned, which can be intercepted by Sener's onerror parameter

When using ts, the returned query and body will get friendly type support according to the template