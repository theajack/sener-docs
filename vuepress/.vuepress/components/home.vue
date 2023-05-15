<template>
    <div class='home-wrapper'>
        <div class='title'>
            <img src='https://shiyix.cn/images/sener.png' alt=''>
        </div>
        <!-- web framework for Node.js -->
        <div class='desc'><span>简洁高效的</span> <span class='sub-desc'>Node Web 框架</span></div>
        
        <div class='start-w'>
            <el-button type='primary' @click='start'>开始 <i class='ei-location-arrow'></i></el-button>
            <!-- <el-button type='primary' @click='run'>试验场 <i class='ei-cube-alt'></i></el-button> -->
            <el-button type='primary' @click='install'>安装 <i class='ei-hand-up'></i></el-button>
        </div>
        <div class='feature-w'>
            <div class='f-i'>
                <a style='font-weight: normal;' href='/cnchar/guide/intro.html#_2-%E5%8A%9F%E8%83%BD'><div class='f-t'><i class='ei-rocket'></i>简洁高效</div></a>
                <div class='f-des'>核心简洁</div>
                <div class='f-des'>ts 100%</div>
                <div class='f-des'>高度类型支持</div>
                <div class='f-des'>无第三方依赖</div>
            </div>
            <div class='f-i'>
                <div class='f-t'><i class='ei-cogs'></i>中间件</div>
                <div class='f-des'>洋葱模型</div>
                <div class='f-des'>Hooks</div>
                <div class='f-des'>高度可扩展</div>
                <div class='f-des'>自定义</div>
            </div>
            <div class='f-i'>
                <div class='f-t'><i class='ei-paint-brush'></i>功能丰富</div>
                <div class='f-des'>cookie</div>
                <div class='f-des'>session</div>
                <div class='f-des'>ip风控</div>
                <div class='f-des'>环境变量</div>
            </div>
        </div>
        <div class='copy-right'>MIT Licensed | Copyright © 2023 - present <a href='https://www.github.com/theajack' target='view_window'>theajack</a></div>
        <div id='comment'>

        </div>
    </div>
</template>

<script>
    import initJSBox from '../../src/jsbox';
    export default {
        data () {
            return {
                loaded: false,
            };
        },
        mounted () {
        },
        methods: {
            start () {
                window.location.href = '/docs-cn/guide/intro.html';
            },
            run () {
                initJSBox().openSample('todo-list');
            },
            install () {
                window.location.href = '/docs-cn/guide/install.html';
            },
        },
    };
</script>

<style lang="less">
    .home-wrapper{
        text-align: center;
        .el-button--primary {
            font-weight: bold;
            font-size: 1rem;
        }
        img.logo{
            width: 100%;
            max-width: 240px;
        }
        .title{
            font-weight: bold;
            font-family: Microsoft Yahei;
            font-size: 3.5rem;
            margin-bottom: 10px;
            margin-top: 80px;
            img{
                width: 150px;
            }
        }
        .desc{
            font-family: sans-serif;
            font-weight: bold;
            font-size: 2.5rem;
            color: #ec5c2f;
            padding-bottom: 20px;
            // background: -webkit-linear-gradient(315deg,#ecd45a 25%,#ec5c2f);
            // background-clip: text;
            // -webkit-background-clip: text;
            // -webkit-text-fill-color: transparent;
            span{
                color:#ec5c2f
            }
            .sub-desc{
                color:#349fd2;
            }
        }
        .test{
            margin: 1.4rem 0;
        }
        .feature-w{
            display: flex;
            justify-content: center;
            max-width: 1000px;
            margin: 0 auto;
            margin-bottom: 40px;
            margin-top: 20px;
            .f-i{
                align-items: center;
                width: 33.3333333%;
                padding: 0 10px;
                .f-t{
                    font-size: 1.3rem;
                    margin-bottom: 1rem;
                    color: #ec5c2f;
                    i{
                        margin-right: 4px;
                    }
                }
                .f-des{
                   line-height: 1.6rem;
                }
            }
        }
        .copy-right{
            margin-top: 1rem;
            color: #aaa;
            font-size: 0.9rem;
        }
        .btn-w{
            max-width: 1000px;
            padding: 0.5rem 0;
            margin: 0 auto;
        }
        .start-w{
            max-width: 1000px;
            padding: 1.5rem 0;
            border-top: 1px solid #eee;
            margin: 0 auto;
        }
        .el-button{
            // font-size: 1rem;
            // padding: 0.8rem 1.2rem;
        }
    }
</style>
