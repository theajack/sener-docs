<!--
  * @Author: chenzhongsheng
  * @Date: 2023-05-14 14:49:08
  * @Description: Coding something
-->
# form middleware

## Install and use

The form middleware is an independent middleware and needs to be installed and used separately

```
npm i sener-form
```

```js
import { Form } from 'sener-form';
new Form();
```

## Basic usage

The form middleware is used to process the data of form-data type, mainly used for file upload

```js
import { Sener, Router } from 'sener';
import { Form } from 'sener-form';

const router = new Router({
     '/demo': ({ formData, files }) => {
         // formData is used to get data, map type
         // files are used to get file objects, map type
         return { data: {success: true} };
     },
});

new Sener({
   middlewares: [router, new Form()],
});
```

## Construction parameters

The form middleware supports the following configurations:

```ts
interface IJsonOptions {
     dir?: string, // dir is used to set the storage directory of file upload files, the default is './public/upload', it will not be created by itself
}
```

## form context

The form middleware specifies two contexts

```ts
interface ISenerHelper {
     files: Files; // files represent the file map object in the obtained formData
     formData: IJson; // formData represents other data in formData
}
```

Here is a simple example:

If the body uploaded by the client is a formdata as follows

```
FormData({
     key: 'test', // simulate a normal value
     img: File, // Simulate uploading an image
})
```

```js
new Router({
     'post:/upload': ({ formData, files }) => {
         // formData => {key: 'test'}
         // files => {img: SenerFile}
         files = transformFilePath(files); // convert local directory to public network url
         return success({ formData, files }, 'file uploaded successfully');
     }
});
```

The following is the structure of the SenerFile object

```ts
interface SenerFile {
     size: number; // file size unit is byte
     filepath: string; // The local directory of the file: such as /public/upload/2023_05/xxxx
     mimetype: string; // file mimetype such as image/png
     mtime: string; // file mtime "2023-05-21T10:21:32.060Z"
     newFilename: string; // new filename
     originalFilename: string; // original filename
}
```