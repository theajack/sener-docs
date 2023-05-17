<!--
 * @Author: chenzhongsheng
 * @Date: 2023-05-12 00:07:52
 * @Description: Coding something
-->


# 简介

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
    <a href="https://fastly.jsdelivr.net/gh/theajack/sener/dist/sener.latest.min.js"><img src="https://img.shields.io/bundlephobia/minzip/sener.svg" alt="Size"></a>
    <a href="https://github.com/theajack/sener/search?l=javascript"><img src="https://img.shields.io/github/languages/top/theajack/sener.svg" alt="TopLang"></a>
    <a href="https://github.com/theajack/sener/issues"><img src="https://img.shields.io/github/issues-closed/theajack/sener.svg" alt="issue"></a>
    <a href="https://www.github.com/theajack/sener"><img src="https://img.shields.io/librariesio/dependent-repos/npm/sener.svg" alt="Dependent"></a>
</div>

<!-- ### Samples

<code-btn type='text' text='Counter' url='@count'/> | 
<code-btn type='text' text='Components & Model' url='@model'/> |
<code-btn type='text' text='Todo List' url='@todo-list'/> |
<code-btn type='text' text='CSS-In-JS' url='@style'/> -->

## 1. 前言

Sener 是一个简洁高效、功能强大、高可扩展的nodejs web服务端框架

Sener 的核心是一个简单的http服务器，配合内置的请求和响应解析以及高度灵活的中间件系统，开发者可以基于Sener开发出功能丰富、性能强大的web应用程序

[反馈问题](https://github.com/theajack/sener/issues/new) 

## 2. 特性

1. 简单高效的架构，全ts编写，高度友好的ts声明支持
2. 支持高度自定义和高可扩展的中间件体系，采用洋葱模型，丰富的路由hooks

## 3. 中间件

| 名称 | 类型 | 功能 | 支持版本 |
| :--: | :--: | :--: | :--: |
| router | 内置 | 简单高可扩展的路由规则 | 0.0.3 |
| cookie | 内置 | 用于cookie获取和注入 | 0.0.15 |
| session | 内置 | 用于session获取和注入[依赖cookie] | 0.0.15 |
| cors | 内置 | 支持跨域请求 | 0.0.3 |
| env | 内置 | 用于注入和使用环境变量 | 0.0.15 |
| ip-monitor | 内置 | 用于对请求ip进行风控拦截 | 0.0.15 |
| validator | 内置 | 支持验证入参和参数类型定义 | 0.0.15 |
| json | 独立 | 支持json文件用于数据存储 | 0.0.4 |
| static | 独立 | 支持静态文件目录 | 0.0.14 |
| form | 独立 | 支持formdata解析和文件上传 | 0.0.11 |
| config | 独立 | 支持高度灵活的参数配置和动态变更与监听 | 0.0.11 |
| log | 独立 | 支持灵活的日志体系，支持日志级别控制 | 0.0.11 |
| mysql | 独立 | 支持mysql连接 | 0.0.12 |
| mongodb | 独立 | 支持mongodb连接，collocation的封装 | 0.0.12 |
| rpc | 独立 | 远程调用支持，支持客户端和服务端使用，支持注入请求的x-trace-id | 0.0.13 |

内置中间件为sener包中自带的中间 但是使用时也需要手动引入

使用独立中间需要安装对应的独立包

## 4. 基础使用

```js
import { Sener, Router } from 'sener';
const router = new Router({
    '/demo': ({ query }) => {
        // or: 'get:/demo': ({ query }) => { // get: prefix can be ignored
        query.message = 'from get';
        return { data: query };
        // Custom headers or statusCode
        // return { data: query, headers: {}, statusCode: 200  };
    },
    'post:/demo': async ({ body }) => {
        body.message = 'from post'
        return { data: body };
    },
});

new Sener({
  port: 9000,
  middlewares: [router],
});
```

如果是nodejs直接使用的话，请使用 cjs 规范引用

```js
const { Sener, Router } = require('sener');
```

后面文档中都是用esm规范，端口都是用默认的9000，如需要cjs请自行修改

<div>
    <star></star>
</div>


