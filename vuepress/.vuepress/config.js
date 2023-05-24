const {version} = require('../../package.json');
const path = require('path');

const docs = [
    {title: '概念与基础', path: 'sener'},
    {title: '中间件体系', path: 'middleware'},
    {title: 'router: 路由', path: 'router'},
    {title: 'cookie', path: 'cookie'},
    {title: 'session', path: 'session'},
    {title: 'cors: 跨域支持', path: 'cors'},
    {title: 'env: 环境变量', path: 'env'},
    {title: 'ip-monitor: ip风控', path: 'ip-monitor'},
    {title: 'validator: 数据校验', path: 'validator'},
    {title: 'json: json数据库', path: 'json'},
    {title: 'static: 静态资源', path: 'static'},
    {title: 'form: formdata&文件', path: 'form'},
    {title: 'config: 动态配置', path: 'config'},
    {title: 'log: 日志', path: 'log'},
    {title: 'mysql', path: 'mysql'},
    {title: 'mongodb', path: 'mongodb'},
    {title: 'rpc: 远程调用', path: 'rpc'},
];

module.exports = {
    title: `Sener (v${version})`, // 标题
    configureWebpack: () => {
        const NODE_ENV = process.env.NODE_ENV;
        // 判断是否是生产环境
        if (NODE_ENV === 'production') {
            return {
                output: {
                    publicPath: 'https://cdn.jsdelivr.net/gh/theajack/sener-docs@gh-pages/docs/'
                    // publicPath: '/docs-cn/' // debug
                },
                resolve: {
                    // 配置路径别名
                    alias: {
                        'public': path.resolve(__dirname, './public')
                    }
                }
            };
        } else {
            return {
                resolve: {
                    // 配置路径别名
                    alias: {
                        'public': path.resolve(__dirname, './public')
                    }
                }
            };
        }
    },
    description: 'Sener - 简洁高效、功能强大、高可扩展的nodejs web服务端框架', // 描述
    keywords: 'sener,nodejs,web-framework',
    dest: './docs/', // 打包地址
    base: '/sener-docs/', // gh-pages分支这里需要改成 / 因为 cnchar.js.org的配置
    // 注入到当前页面的 HTML <head> 中的标签
    head: [
        ['link', {rel: 'icon', href: 'https://shiyix.cn/images/sener.ico'}], // 增加一个自定义的 favicon
    ],
    // dest: './dist', //打包位置
    port: 6868, // 端口号
    // 主题配置
    devServer: {
        proxy: {
            '/api': {
                target: 'https://shiyix.cn/',
                // pathRewrite: {'^/remote': ''},
                changeOrigin: true,
                secure: false
            }
        }
    },
    themeConfig: {
        // 顶部导航栏配置
        nav: [
            {text: '主页', link: '/'}, // 内部链接 以docs为根目录
            // {text: '捐赠', link: '/guide/donate'},
            // {text: 'GitHub', link: ''},
            {text: 'English', link: 'https://theajack.github.io/sener-docs'},
            {
                text: '起步',
                items: [
                    {text: '简介', link: '/guide/intro'},
                    {text: '安装使用', link: '/guide/install'},
                    {text: '更新日志', link: '/guide/version'},
                    // {text: '捐赠', link: '/guide/donate'},
                ]
            },
            {
                text: '文档',
                // 这里是下拉列表展现形式。
                items: docs.map(item => {
                    return {
                        text: item.title,
                        link: '/doc/' + item.path,
                    };
                }),
            },
            {
                text: 'GitHub',
                items: [
                    {text: 'Sener', link: 'https://www.github.com/theajack/sener'},
                    {text: '文档', link: 'https://www.github.com/theajack/sener-docs'},
                    {text: '作者', link: 'https://www.github.com/theajack'}, // 外部链接
                    // {text: 'Gitee地址', link: 'http://www.gitee.com/theajack'},
                    // {
                    //     text: 'CSDN账号',
                    //     link: 'https://blog.csdn.net/yanxiaomu',
                    // },
                ],
            },
            // {
            //     text: 'Author',
            //     items: [
            //         {text: 'GitHub', link: 'https://www.github.com/theajack'}, // 外部链接
            //         // {text: 'Gitee地址', link: 'http://www.gitee.com/theajack'},
            //         // {
            //         //     text: 'CSDN账号',
            //         //     link: 'https://blog.csdn.net/yanxiaomu',
            //         // },
            //     ],
            // },
        ],
        // 这里使用的是多个侧边栏设置
        sidebar: {
            // 如果你不需要文档版本功能，只需去掉2.0，1.0文件夹，将md文件直接放在components文件夹下
            '/doc/': [
                {
                    title: 'Sener文档', // 必要的
                    path: '', // 如果你不想'基础组件'可点击并有对应说明，就直接设为空，或者不写,并且nav的link也不要指向 '/components/2.0/'而是'/components/2.0/catButton'
                    collapsable: false, // 可选的, 右侧侧边栏是否展开,默认值是 true
                    // 如果组件很多时，建议将children配置单独放到一个js文件中，然后进行引入
                    children: docs,
                },
            ],
            '/guide/': [
                {
                    title: '起步',
                    path: '',
                    collapsable: false,
                    children: [
                        {title: '简介', path: 'intro'},
                        {title: '安装使用', path: 'install'},
                        {title: '更新日志', path: 'version'},
                        // {title: '捐赠', path: 'donate'},
                    ],
                },
            ],
        },
        sidebarDepth: 1, // 将同时提取markdown中h2，显示在侧边栏上
        lastUpdated: '文档更新时间', // 文档更新时间：每个文件git最后提交的时间
    },

    markdown: {
        // lineNumbers: true // 代码块显示行号
    },

    plugins: [
        // 官方回到顶部插件
        '@vuepress/back-to-top',

        // 官方图片放大组件 目前是所有img都可以点击放大。具体配置见https://v1.vuepress.vuejs.org/zh/plugin/official/plugin-medium-zoom.html
        ['@vuepress/medium-zoom', {selector: 'img'}],
        ['vuepress-plugin-tc-comment', {
            appName: 'sener-docs', // create your own app name
            theme: 'dark',
        }]
    ],

};
