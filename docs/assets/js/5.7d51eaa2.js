(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{566:function(t,s,e){"use strict";e(163);const i={},n={},o=t=>void 0===t;function a(t){return!!i[t]}class c{constructor(t){this.name=t,this.listeners=[]}regist(t){this.listeners.push(t)}emit(t){this.listeners.forEach(s=>{s(t)})}}s.a={EVENT:n,emit:function(t,s){a(t)&&i[t].emit(s)},regist:function t(s,e){if("object"!=typeof s)a(s)||function(t){o(n[t])&&(i[t]=new c(t),n[t]=t)}(s),i[s].regist(e);else for(const e in s)t(e,s[e])},checkEvent:a,remove:function(t,s){if(!a(t))return console.warn("removeEvent:未找到事件 "+t),!1;if(o(s))return console.error("请传入要移除的listener"),!1;{const e=i[t].listeners.indexOf(s);return-1===e?(console.warn("removeEvent:未找到监听函数 "+t),!1):(i[t].listeners.splice(e,1),!0)}}}},567:function(t,s,e){"use strict";e.d(s,"b",(function(){return o}));var i=e(566);let n=null;const o={visible:!0};function a(){let t="";const s=window.location.host;return t=-1!==s.indexOf("localhost")||"theajack.github.io"===s?"https://theajack.github.io":window.location.protocol+"//theajack.gitee.io",t+"/jsbox/?remind=false&mes=false"}s.a=function(){if(null!==n)return n;!function(){const t=console.log;console.log=(...s)=>{i.a.emit("onlog",s),t(...s)}}(),function(){const t=document.createElement("style");t.innerText="\n    .jsbox-mask{\n        position: fixed;\n        z-index: 1000;\n        left: 0;\n        top: 0;\n        width: 100%;\n        height: 100%;\n        background-color: #000000dd;\n        display: none;\n    }\n    .jsbox-header{\n        height: 4%;\n        vertical-align: middle;\n        font-size: 1rem;\n        color: #eee;\n        display: flex;\n        align-items: center;\n        padding: 0 5px;\n        background-color: #1e1e1e;\n    }\n    .jsbox-link{\n        margin-left: 5px;\n    }\n    .jsbox-close{\n        cursor: pointer;\n        position: absolute;\n        right: 10px;\n        font-size: 1.5rem;\n    }\n    .jsbox-close:hover{\n        color: #e88;\n    }\n    .jsbox-iframe{\n        width: 100%;\n        height: 96%;\n        box-shadow: 0 0 15px #000;\n        position: relative;\n    }\n    .jsbox-loading-w{\n        position: absolute;\n        font-size: 3rem;\n        color: #aaa;\n        top: 50%;\n        transform: translate(-50%,-50%);\n        left: 50%;\n    }",document.head.appendChild(t)}();const t=function(){const t=document.createElement("div");return t.className="jsbox-mask",t.innerHTML="\n    <div class='jsbox-header'>\n        Powered by <a class='jsbox-link' target='view_window' href='https://github.com/theajack/jsbox'><i class='ei-cube-alt'></i> JSBox</a>\n        <i class='ei-times jsbox-close'></i>\n    </div>\n    <div class='jsbox-loading-w'><i class='ei-spinner-indicator ei-spin'></i></div>\n    <iframe class='jsbox-iframe' src='' frameborder='0'></iframe>",document.body.appendChild(t),t}(),s=t.querySelector(".jsbox-iframe");function e(t){n.url!==t&&(n.url=t,s.src=n.url)}function o(){t.style.display="block",document.body.style.overflow="hidden"}function c(){t.style.display="none",document.body.style.overflow="auto"}return t.querySelector(".jsbox-close").onclick=c,n={open:o,close:c,code:function(t="",s="javascript",i="sener"){n._code!==t&&(n._code=t,e(`${a()}&env=${i}&code=${encodeURIComponent(t)}&lang=${s}`)),o()},openUrl:function(t){e(t.replace("?","?remind=false&mes=false&")),o()},openGitHub:function(t){e(`${a()}&github=${t}`),o()},openSample:function(t){e(`${a()}&codeSrc=${location.protocol}//${location.host}/sener-docs/samples/${t}.js`),o()}},n}},586:function(t,s,e){},610:function(t,s,e){"use strict";e(586)},621:function(t,s,e){"use strict";e.r(s);var i=e(567),n={data:()=>({loaded:!1}),mounted(){},methods:{start(){window.location.href="/sener-docs/guide/intro.html"},run(){Object(i.a)().openSample("todo-list")},install(){window.location.href="/sener-docs/guide/install.html"}}},o=(e(610),e(11)),a=Object(o.a)(n,(function(){var t=this,s=t._self._c;return s("div",{staticClass:"home-wrapper"},[t._m(0),t._v(" "),t._m(1),t._v(" "),s("div",{staticClass:"start-w"},[s("el-button",{attrs:{type:"primary"},on:{click:t.start}},[t._v("Start "),s("i",{staticClass:"ei-location-arrow"})]),t._v(" "),s("el-button",{attrs:{type:"primary"},on:{click:t.install}},[t._v("Install "),s("i",{staticClass:"ei-hand-up"})])],1),t._v(" "),t._m(2),t._v(" "),t._m(3),t._v(" "),s("div",{attrs:{id:"comment"}})])}),[function(){var t=this._self._c;return t("div",{staticClass:"title"},[t("img",{attrs:{src:"https://shiyix.cn/images/sener.png",alt:""}})])},function(){var t=this._self._c;return t("div",{staticClass:"desc"},[t("span",[this._v("Concise and efficient")]),this._v(" "),t("span",{staticClass:"sub-desc"},[this._v("Node Web Framework")])])},function(){var t=this,s=t._self._c;return s("div",{staticClass:"feature-w"},[s("div",{staticClass:"f-i"},[s("a",{staticStyle:{"font-weight":"normal"},attrs:{href:"/cnchar/guide/intro.html#_2-%E5%8A%9F%E8%83%BD"}},[s("div",{staticClass:"f-t"},[s("i",{staticClass:"ei-rocket"}),t._v("Concise and efficient")])]),t._v(" "),s("div",{staticClass:"f-des"},[t._v("The core is concise")]),t._v(" "),s("div",{staticClass:"f-des"},[t._v("ts 100%")]),t._v(" "),s("div",{staticClass:"f-des"},[t._v("Strong type support")]),t._v(" "),s("div",{staticClass:"f-des"},[t._v("No third-party dependencies")])]),t._v(" "),s("div",{staticClass:"f-i"},[s("div",{staticClass:"f-t"},[s("i",{staticClass:"ei-cogs"}),t._v("Middleware")]),t._v(" "),s("div",{staticClass:"f-des"},[t._v("onion model")]),t._v(" "),s("div",{staticClass:"f-des"},[t._v("Hooks")]),t._v(" "),s("div",{staticClass:"f-des"},[t._v("Highly scalable")]),t._v(" "),s("div",{staticClass:"f-des"},[t._v("Custom")])]),t._v(" "),s("div",{staticClass:"f-i"},[s("div",{staticClass:"f-t"},[s("i",{staticClass:"ei-paint-brush"}),t._v("Feature-rich")]),t._v(" "),s("div",{staticClass:"f-des"},[t._v("cookie")]),t._v(" "),s("div",{staticClass:"f-des"},[t._v("session")]),t._v(" "),s("div",{staticClass:"f-des"},[t._v("ip risk control")]),t._v(" "),s("div",{staticClass:"f-des"},[t._v("environment variables")])])])},function(){var t=this._self._c;return t("div",{staticClass:"copy-right"},[this._v("MIT Licensed | Copyright © 2023 - present "),t("a",{attrs:{href:"https://www.github.com/theajack",target:"view_window"}},[this._v("theajack")])])}],!1,null,null,null);s.default=a.exports}}]);