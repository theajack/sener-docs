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

Sener 的核心是一个简单的http服务器

[反馈问题](https://github.com/theajack/sener/issues/new) 

## 2. 特性

1. 无vdom，监听数据精准修改到dom/textNode，dom节点复用
2. alins-style css-in-js方案，原子属性/积木式组合/样式响应变更
3. 良好的组件化支持
4. 支持for,if,show,switch,model控制器
5. 支持computed、watch
6. 单向数据流 + 双向绑定
7. 良好的ts支持

## 3. 包结构

|     名称     | 描述 |   功能   | 支持版本 |
| :----------: | :------------------------------: | :--------------------: | :--------------------: |
|    alins    | alins主库 |  用于创建web应用程序   | 0.0.1 |
|    alins-style    | css-in-js方案 |  不依赖于alins可以独立于alins使用  | 0.0.1 |

除此之外 Alins还包含两个工具库，一般不需要开发者引入

1. alins-reactive: alins 和 alins-style 共同依赖的响应式库
2. alins-utils: 其他三个包依赖的工具库

<div>
    <star></star>
</div>


