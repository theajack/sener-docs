<!--
 * @Author: chenzhongsheng
 * @Date: 2022-10-30 02:42:04
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-13 17:23:47
-->
<template>
    <div v-show='localCode!==""' class='code-runner' ref='runner'>
        <span class='code-title'>{{title}}</span>
        <span class='code-desc'>{{result ? desc: ''}}</span>
        <!-- <i class='ei-play code-btn' @click='jsbox' title='打开jsbox'></i> -->
        <i class='ei-copy code-btn' @click='copy' title='复制代码'></i>
        <!-- <i class='ei-undo code-btn' @click='run' title='重新运行'></i> -->
        <i class='code-btn' :class="{'ei-eye-close': showCode.visible, 'ei-eye-open': !showCode.visible}"
           @click='toggleShowCode' :title='showCode.visible?"隐藏代码":"显示代码"'></i>
        <!-- <i v-show='result && !isEdit' class='ei-code code-btn' @click='edit' title='开启编辑'></i> -->
    </div>
</template>

<script>
    import initJSBox, {showCode} from '../../src/jsbox';
    import {copy} from '../../src/util';
    let jsbox = null;
    export default {
        props: {
            title: {
                type: String,
                default: '演示程序'
            },
            desc: {
                type: String,
                default: '右侧按钮可以开启编辑|在线运行'
            },
            result: {
                type: Boolean,
                default: true
            },
        },
        // computed: {
        //     editClass () {
        //         return this.isEdit ? 'ei-undo' : 'ed-edit';
        //     }
        // },
        data () {
            return {
                showCode: showCode,
                isEdit: false,
                localCode: '',
                localLang: '',
                env: 'sener',
                next: null,
            };
        },
        mounted () {
            this.next = this.getNext();
            jsbox = initJSBox();
            this.initCode();
            console.log('mounted');
        },
        watch: {
            'showCode.visible' () {
                this.initCodeVisible();
            }
        },
        methods: {
            initCodeVisible () {
                this.next.style.display = this.showCode.visible ? 'block' : 'none';
            },
            toggleShowCode () {
                this.showCode.visible = !this.showCode.visible;
                this.initCodeVisible();
            },
            getNext () {
                const el = this.$refs.runner;
                if (!el) return null;
                const next = el.nextElementSibling;
                if (!next) return null;
                return next;
            },
            initCode () {
                const next = this.next;
                if (!next) return;
                if (next.className.indexOf('language-js') !== -1) {
                    this.localLang = 'javascript';
                } else if (next.className.indexOf('language-html') !== -1) {
                    this.localLang = 'html';
                }

                this.runBase(next);
            },
            run () {
                const next = this.next;
                if (!next) return;
                if (this.codeResultEl) this.codeResultEl.innerHTML = '';
                this.runBase(next);
                this.$toast('重新运行成功');
            },
            edit () {
                const next = this.next;
                const pre = next.querySelector('pre');
                pre.classList.add('edited');
                const code = pre.children[0];
                code.setAttribute('contenteditable', 'true');
                code.setAttribute('style', '-webkit-user-modify: read-write-plaintext-only;');
                code.setAttribute('spellcheck', 'false');
                code.textContent = code.innerText;
                this.isEdit = true;
            },
            runBase (next) {
                if (this.localLang) {
                    this.localCode = this.transformCode(next.querySelector('code').innerText);
                }
                this.initResult(next);
            },
            initResult () {
                return;
            },
            jsbox () {
                jsbox.code(this.localCode, this.localLang, this.env);
            },
            copy () {
                this.$toast(copy(this.next.querySelector('code').innerText) ? '复制成功' : '复制失败');
            },
            transformCode (code) {
                return code;
            }
        }
    };
</script>

<style lang="less">
.code-runner{
    margin-top: 15px;
    .code-title{
        font-weight: bold;
        margin-right: 10px;
    }
    .code-desc{
        font-size: 0.8rem;
        color: #aaa;
    }
}
.code-btn{
    float: right;
    color: #ec5c2f;
    margin-left: 10px;
    cursor: pointer;
    transition: transform .3s ease;
    margin-top: 5px;
    &:hover{
        transform: scale(1.2);
    }
    &.in-result{
        margin: 0;
        font-size: 20px;
    }
}
</style>
