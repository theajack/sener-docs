<!--
 * @Author: chenzhongsheng
 * @Date: 2022-11-04 20:16:21
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-13 17:20:45
-->
<template>
    <el-button class='code-btn-w'
               :type='type'
               size='large'
               @click='run'>{{text}}</el-button>
</template>

<script>
    export default {
        props: {
            text: {
                type: String,
                default: '运行'
            },
            type: {
                type: String,
                default: 'primary'
            },
            url: {
                type: String,
                default: '',
            }
        },
        mounted () {
        },
        methods: {
            run () {
            }
        }
    };
</script>

<style lang="less">

.code-btn-w {
    margin: 0!important;
    span {
        font-size: 16px;
        color: #f5d63b;
        text-decoration: underline;
        &:hover{
            color: rgb(233, 215, 122);
        }
    }
}
</style>
