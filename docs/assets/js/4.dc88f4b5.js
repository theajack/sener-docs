(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{566:function(t,e,o){"use strict";o(163);const n={},s={},i=t=>void 0===t;function l(t){return!!n[t]}class c{constructor(t){this.name=t,this.listeners=[]}regist(t){this.listeners.push(t)}emit(t){this.listeners.forEach(e=>{e(t)})}}e.a={EVENT:s,emit:function(t,e){l(t)&&n[t].emit(e)},regist:function t(e,o){if("object"!=typeof e)l(e)||function(t){i(s[t])&&(n[t]=new c(t),s[t]=t)}(e),n[e].regist(o);else for(const o in e)t(o,e[o])},checkEvent:l,remove:function(t,e){if(!l(t))return console.warn("removeEvent:未找到事件 "+t),!1;if(i(e))return console.error("请传入要移除的listener"),!1;{const o=n[t].listeners.indexOf(e);return-1===o?(console.warn("removeEvent:未找到监听函数 "+t),!1):(n[t].listeners.splice(o,1),!0)}}}},567:function(t,e,o){"use strict";o.d(e,"b",(function(){return i}));var n=o(566);let s=null;const i={visible:!0};function l(){let t="";const e=window.location.host;return t=-1!==e.indexOf("localhost")||"theajack.github.io"===e?"https://theajack.github.io":window.location.protocol+"//theajack.gitee.io",t+"/jsbox/?remind=false&mes=false"}e.a=function(){if(null!==s)return s;!function(){const t=console.log;console.log=(...e)=>{n.a.emit("onlog",e),t(...e)}}(),function(){const t=document.createElement("style");t.innerText="\n    .jsbox-mask{\n        position: fixed;\n        z-index: 1000;\n        left: 0;\n        top: 0;\n        width: 100%;\n        height: 100%;\n        background-color: #000000dd;\n        display: none;\n    }\n    .jsbox-header{\n        height: 4%;\n        vertical-align: middle;\n        font-size: 1rem;\n        color: #eee;\n        display: flex;\n        align-items: center;\n        padding: 0 5px;\n        background-color: #1e1e1e;\n    }\n    .jsbox-link{\n        margin-left: 5px;\n    }\n    .jsbox-close{\n        cursor: pointer;\n        position: absolute;\n        right: 10px;\n        font-size: 1.5rem;\n    }\n    .jsbox-close:hover{\n        color: #e88;\n    }\n    .jsbox-iframe{\n        width: 100%;\n        height: 96%;\n        box-shadow: 0 0 15px #000;\n        position: relative;\n    }\n    .jsbox-loading-w{\n        position: absolute;\n        font-size: 3rem;\n        color: #aaa;\n        top: 50%;\n        transform: translate(-50%,-50%);\n        left: 50%;\n    }",document.head.appendChild(t)}();const t=function(){const t=document.createElement("div");return t.className="jsbox-mask",t.innerHTML="\n    <div class='jsbox-header'>\n        Powered by <a class='jsbox-link' target='view_window' href='https://github.com/theajack/jsbox'><i class='ei-cube-alt'></i> JSBox</a>\n        <i class='ei-times jsbox-close'></i>\n    </div>\n    <div class='jsbox-loading-w'><i class='ei-spinner-indicator ei-spin'></i></div>\n    <iframe class='jsbox-iframe' src='' frameborder='0'></iframe>",document.body.appendChild(t),t}(),e=t.querySelector(".jsbox-iframe");function o(t){s.url!==t&&(s.url=t,e.src=s.url)}function i(){t.style.display="block",document.body.style.overflow="hidden"}function c(){t.style.display="none",document.body.style.overflow="auto"}return t.querySelector(".jsbox-close").onclick=c,s={open:i,close:c,code:function(t="",e="javascript",n="sener"){s._code!==t&&(s._code=t,o(`${l()}&env=${n}&code=${encodeURIComponent(t)}&lang=${e}`)),i()},openUrl:function(t){o(t.replace("?","?remind=false&mes=false&")),i()},openGitHub:function(t){o(`${l()}&github=${t}`),i()},openSample:function(t){o(`${l()}&codeSrc=${location.protocol}//${location.host}/docs-cn/samples/${t}.js`),i()}},s}},568:function(t,e,o){"use strict";function n(t){const e=t.match(/<script(.|\n)*?>(.|\n)*?<\/script>/g);if(!e)return{html:t,js:""};let o=e.map(e=>(t=t.replace(e,""),function(t,e="script"){return t.substring(t.indexOf(">")+1,t.lastIndexOf("</"+e+">")).trim()}(e))).join("\n").trim();return o&&(o="//@ sourceURL=jsbox_run.js \n"+o),{html:t,js:o}}function s({code:t=""}){""!==t.trim()?(-1===t.indexOf("\n")&&(t=`console.log(${t})`),new Function(t.trim())()):console.warn("execute code 参数不可为空")}function i(t){let e=document.getElementById("_copy_input_");e||(e=document.createElement("textarea"),e.setAttribute("type","text"),e.setAttribute("style","height:10px;position:fixed;top:-100px;opacity:0;"),e.setAttribute("id","_copy_input_"),document.body.appendChild(e)),e.value=t,e.select();try{return!!document.execCommand("Copy")}catch(t){return!1}}o.d(e,"c",(function(){return n})),o.d(e,"b",(function(){return s})),o.d(e,"a",(function(){return i}))},585:function(t,e,o){},609:function(t,e,o){"use strict";o(585)},620:function(t,e,o){"use strict";o.r(e);var n=o(567),s=o(568),i=o(566);let l=null;var c={props:{id:{type:String,default:"easy-use"},code:{type:String,default:""},format:{type:Boolean,default:!1},fold:{type:Boolean,default:!1},lang:{type:String,default:"javascript"},title:String,desc:String,onlineLink:{type:String,default:""}},data:()=>({localCode:"",localLang:"",localDesc:"",localFold:"",html:""}),mounted(){if(l=Object(n.a)(),this.localFold=this.fold,this.code)this.localCode=this.code,this.localLang=this.lang,this.localDesc=this.desc;else{const t=window.jsbox_config.codes;this.localCode=t[this.id].code,this.localLang="html"===t[this.id].lang?"html":"javascript",this.localDesc=t[this.id].desc||this.desc}let t="";if("html"===this.localLang){const e=Object(s.c)(this.localCode);t=e.js,this.html=e.html}else t=this.localCode;this.$nextTick(()=>{i.a.regist("onlog",this.onLog),Object(s.b)({code:t}),i.a.remove("onlog",this.onLog)})},methods:{onLog(t){if("html"===this.localLang)return;let e="",o="";t.forEach(t=>{"object"==typeof t&&(t instanceof Array&&!this.format||(o='style="white-space: pre"'),t=JSON.stringify(t,null,4)),e+=`<div ${o}>${t}</div>`}),this.html+=e},copy(){Object(s.a)(this.localCode)?this.$message.success("复制成功"):this.$message.error("复制成功")},run(){this.code?l.code(this.code):l.id(this.id)},showToggle(){this.localFold=!this.localFold}}},a=(o(609),o(11)),r=Object(a.a)(c,(function(){var t=this,e=t._self._c;return e("div",{staticClass:"code-box"},[e("div",{staticClass:"code-runner"},[e("span",{staticClass:"code-title"},[t._v(t._s(t.title||t.id))]),t._v(" "),e("span",{staticClass:"code-desc"},[t._v(t._s(t.localDesc))]),t._v(" "),e("i",{staticClass:"ei-play code-btn",attrs:{title:"在线运行"},on:{click:t.run}}),t._v(" "),e("i",{staticClass:"ei-copy code-btn",attrs:{title:"复制代码"},on:{click:t.copy}})]),t._v(" "),e("highlight-code",{attrs:{code:t.localCode,lang:t.localLang}}),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:""!==t.html,expression:'html!==""'}]},[e("div",{staticClass:"output-title"},[t._v("运行结果")]),t._v(" "),e("div",{staticClass:"output-area",class:{folded:t.localFold}},[e("div",{staticClass:"show-toggle",on:{click:t.showToggle}},[e("i",{class:"ei-angle-"+(t.localFold?"down":"up")}),t._v(" "),e("span",{staticClass:"show-text"},[t._v(t._s(t.localFold?"显示结果":"隐藏结果"))])]),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:!t.localFold,expression:"!localFold"}],domProps:{innerHTML:t._s(t.html)}})])]),t._v(" "),t._m(0)],1)}),[function(){var t=this._self._c;return t("div",{staticClass:"powered-by"},[this._v("\n        Powered by "),t("a",{staticClass:"jsbox-link",attrs:{target:"view_window",href:"https://github.com/theajack/jsbox"}},[t("i",{staticClass:"ei-cube-alt"}),this._v(" JSBox")])])}],!1,null,"5108a782",null);e.default=r.exports}}]);