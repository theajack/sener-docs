<!--
  * @Author: chenzhongsheng
  * @Date: 2022-11-05 10:51:06
  * @Description: Coding something
  * @LastEditors: Please set LastEditors
  * @LastEditTime: 2023-05-21 12:46:37
-->

# Concepts and basics

## Sener construction

Developers can use Sener to start a server. The constructor accepts an optional json parameter, which contains the following three optional attributes:

1. port: Specify the port number of the server, the default value is 9000
2. middlewares: Pass in an array of middleware, the default is []
3. onerror: Custom processing errors in the request, the default is empty, and it will be handled by sener

```js
import {Sener} from 'sener';
new Sener();
```

with parameters
```js
import {Sener} from 'sener';
new Sener({
     port: 9000,
     middlewares: [],
     onerror({error, from, context}){
         // ...do something
     }
});
```

The onerror callback parameters are as follows

```ts
export type IOnError = (err: {
   error: any,
   from: IErrorFrom,
   context: ISenerContext
}) => IPromiseMayBe<ISenerResponse>;
```

You can import IOnError interface from sener

```ts
import {IOnError} from 'sener';
```

1. error is the error thrown during the request
2. from is the stage where an error is thrown, the optional value is 'enter' | 'request' | 'response' | 'leave'
3. context is the context of the request, which will be introduced below

## request context

Request context (ISenerContext) is a very important concept in Sener. It is a json object that contains many important attributes. The context is used in middleware hooks, which will be introduced in the subsequent middleware chapters

```ts
import {ISenerContext} from 'sener';
```

ISenerContext attributes and introduction are as follows

```ts
interface ISenerContext {
     requestHeaders: IncomingHttpHeaders; // request header
     url: string; // request url
     method: IServeMethod;
     query: IJson<any>;
     body: IJson<any>; // body parsed json
     buffer: Buffer|null; // Request the original data of the body
     ip: string; // client ip

     request: IncomingMessage; // HTTP module native request object
     response: IResponse; // HTTP module native response object
     env: ISenerEnv & IJson; // Environment variable injected by env middleware
     responded: boolean; // mark whether a response has been constructed
     isOptions: boolean; // Whether the tag is an options request
     returned: boolean; // mark whether a response has been sent

     // response returns
     data: T, // The data returned by the response
     statusCode: number, // The error code returned by the response
     headers: IJson<string>; // The headers returned by the response
     success: boolean; // Indicates whether the request is successful

     ...ISenerHelper; // This parameter is a helper customized by the middleware, which will be introduced in the subsequent custom middleware chapter

     // utility function
     response404: (errorMessage?: string, header?: IJson<string>) => ISenerResponse; // Construct 404 response
     responseJson: (data: IJson, statusCode?: number, header?: IJson<string>) => ISenerResponse; // construct json response
     responseText: (text: string, statusCode?: number, header?: IJson<string>) => ISenerResponse; // construct text response
     responseHtml: (html: string, header?: IJson<string>) => ISenerResponse; // construct html response
     responseData: (data: Partial<ISenerResponse>) => ISenerResponse; // Construct a general response
     markReturned: () => void; // mark as returned response early
}
```

## Tool method

As can be seen from the declaration in the above section, context contains six tool methods

The markReturned tool method is used to mark the sent status after the response has been sent to the client through the native response, which can skip subsequent unnecessary middleware and return the response.

The other five responseXXX methods are merged into the context for constructing the response, and will not return the response directly

The tool method can be used in custom middleware or router, for detailed usage, please refer to router middleware

## Other APIs

### 1. use

use is used to dynamically add a middleware

```js
const sener = new Sener();
sener.use(customMiddleware);
```

### 2. remove

remove is used to dynamically remove a middleware

```js
const sener = new Sener();
sener. remove(customMiddleware);
```

### 3. Dir

Dir is a static property used to get or set Sener's data root directory

Default is homedir() + './sener-data'

```js
Sener.Dir;
Sener.Dir = '/custom-dir';
```

### 3. Version

Version is a static property used to get the version number

```js
Sener. Version;
```