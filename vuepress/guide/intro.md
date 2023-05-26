<!--
  * @Author: chenzhongsheng
  * @Date: 2023-05-12 00:07:52
  * @Description: Coding something
-->


# Introduction

--------------------

<div style="margin: 10px">
     <a href="https://www.github.com/theajack/sener/stargazers" target="_black">
         <img src="https://img.shields.io/github/stars/theajack/sener?logo=github" alt="stars" />
     </a>
     <a href="https://www.github.com/theajack/sener/network/members" target="_black">
         <img src="https://img.shields.io/github/forks/theajack/sener?logo=github" alt="forks" />
     </a>
     <a href="https://www.npmjs.com/package/sener" target="_black">
         <img src="https://img.shields.io/npm/v/sener?logo=npm" alt="version" />
     </a>
     <a href="https://www.npmjs.com/package/sener" target="_black">
         <img src="https://img.shields.io/npm/dm/sener?color=%23ffca28&logo=npm" alt="downloads" />
     </a>
     <a href="https://www.jsdelivr.com/package/npm/sener" target="_black">
         <img src="https://data.jsdelivr.com/v1/package/npm/sener/badge" alt="jsdelivr" />
     </a>
</div>

<div style="margin: 10px">
     <a href="https://github.com/theajack" target="_black">
         <img src="https://img.shields.io/badge/Author-%20theajack%20-7289da.svg?&logo=github" alt="author" />
     </a>
     <a href="https://www.github.com/theajack/sener/blob/master/LICENSE" target="_black">
         <img src="https://img.shields.io/github/license/theajack/sener?color=%232DCE89&logo=github" alt="license" />
     </a>
     <a href="https://fastly.jsdelivr.net/gh/theajack/sener/dist/sener.latest.min.js"><img src="https://img.shields.io/bundlephobia/minzip /sener.svg" alt="Size"></a>
     <a href="https://github.com/theajack/sener/search?l=javascript"><img src="https://img.shields.io/github/languages/top/theajack/sener.svg " alt="TopLang"></a>
     <a href="https://github.com/theajack/sener/issues"><img src="https://img.shields.io/github/issues-closed/theajack/sener.svg" alt=" issue"></a>
     <a href="https://www.github.com/theajack/sener"><img src="https://img.shields.io/librariesio/dependent-repos/npm/sener.svg" alt=" Dependent"></a>
</div>

<!-- ### Samples

<code-btn type='text' text='Counter' url='@count'/> |
<code-btn type='text' text='Components & Model' url='@model'/> |
<code-btn type='text' text='Todo List' url='@todo-list'/> |
<code-btn type='text' text='CSS-In-JS' url='@style'/> -->

## 1 Introduction

Sener is a simple, efficient, powerful, and highly scalable nodejs web server framework

The core of Sener is a simple http server, with built-in request and response parsing and highly flexible middleware system, developers can develop feature-rich and powerful web applications based on Sener

[Feedback issues](https://github.com/theajack/sener/issues/new)

## 2. Features

1. Simple and efficient architecture, full ts writing, highly friendly ts statement support
2. Support highly customized and highly scalable middleware system, adopt the onion model, rich routing hooks

## 3. Middleware

| Name | Type | Function | Supported Version |
| :--: | :--: | :--: | :--: |
| router | built-in | simple and highly scalable routing rules | 0.0.3 |
| cookie | built-in | for cookie fetching and injection | 0.0.15 |
| session | built-in | for session acquisition and injection [depends on cookie] | 0.0.15 |
| cors | built-in | support for cross-origin requests | 0.0.3 |
| env | built-in | for injecting and using environment variables | 0.0.15 |
| ip-monitor | built-in | used for risk control interception of request ip | 0.0.15 |
| validator | built-in | supports validating input parameters and parameter type definitions | 0.0.15 |
| json | standalone | support json files for data storage | 0.0.4 |
| static | standalone | support static file directory | 0.0.14 |
| form | Standalone | Support formdata parsing and file upload | 0.0.11 |
| config | independent | supports highly flexible parameter configuration and dynamic change and monitoring | 0.0.11 |
| log | Independent | Support flexible log system, support log level control | 0.0.11 |
| mysql | standalone | support mysql connection | 0.0.12 |
| mongodb | standalone | support mongodb connection, collocation encapsulation | 0.0.12 |
| rpc | stand-alone | remote call support, support client and server use, support x-trace-id injection request | 0.0.13 |

The built-in middleware is the middleware that comes with the sener package, but it needs to be manually introduced when using it

To use the independent middle, you need to install the corresponding independent package

## 4. Basic use

```js
import { Sener, Router } from 'sener';
const router = new Router({
     '/demo': ({ query }) => {
         // or: 'get:/demo': ({ query }) => { // get: prefix can be ignored
         query.message = 'from get';
         return { data: query };
         // Custom headers or statusCode
         // return { data: query, headers: {}, statusCode: 200 };
     },
     'post:/demo': async ({ body }) => {
         body. message = 'from post'
         return { data: body };
     },
});

new Sener({
   port: 9000,
   middlewares: [router],
});
```

If it is used directly by nodejs, please use the cjs specification reference

```js
const { Sener, Router } = require('sener');
```

The esm specification is used in the following documents, and the default port is 9000. If you need cjs, please modify it yourself

<div>
     <star></star>
</div>