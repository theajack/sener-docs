const {version} = require('../../package.json');
const path = require('path');

const docs = [
    {title: 'Concept and Basics', path: 'sener'},
    {title: 'middleware system', path: 'middleware'},
    {title: 'router: Routing', path: 'router'},
    {title: 'cookie', path: 'cookie'},
    {title: 'session', path: 'session'},
    {title: 'cors: cross domain support', path: 'cors'},
    {title: 'env: Environment Variables', path: 'env'},
    {title: 'ip-monitor: ip risk control', path: 'ip-monitor'},
    {title: 'validator: Data Validation', path: 'validator'},
    {title: 'json: json database', path: 'json'},
    {title: 'static: static resources', path: 'static'},
    {title: 'form: formdata&file', path: 'form'},
    {title: 'config: Dynamic Configuration', path: 'config'},
    {title: 'log: log', path: 'log'},
    {title: 'mysql', path: 'mysql'},
    {title: 'mongodb', path: 'mongodb'},
    {title: 'rpc: Remote Call', path: 'rpc'},
];

module.exports = {
    title: `Sener (v${version})`, // 标题
    configureWebpack: () => {
        const NODE_ENV = process.env.NODE_ENV;
        // 判断是否是生产环境
        if (NODE_ENV === 'production') {
            return {
                output: {
                    publicPath: 'https://cdn.jsdelivr.net/gh/theajack/sener-docs@gh-pages/'
                    // publicPath: '/sener-docs/' // debug
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
    description: 'Sener - Simple, efficient, powerful, and highly scalable nodejs web server framework', // 描述
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
            {text: 'Home', link: '/'}, // internal link with docs as the root directory
            // {text: 'Donate', link: '/guide/donate'},
            // {text: 'GitHub', link: ''},
            {text: '中文', link: 'https://theajack.github.io/sener-docs-cn'},
            {
                text: 'Start',
                items: [
                    {text: 'Introduction', link: '/guide/intro'},
                    {text: 'Install and use', link: '/guide/install'},
                    {text: 'Update log', link: '/guide/version'},
                // {text: 'Donate', link: '/guide/donate'},
                ]
            },
            {
                text: 'Docs',
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
                    {text: 'Docs', link: 'https://www.github.com/theajack/sener-docs'},
                    {text: 'Author', link: 'https://www.github.com/theajack'}, // external link
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
        sidebar: {// If you don't need the document version function, just remove the 2.0 and 1.0 folders and put the md file directly in the components folder
            '/doc/': [
                {
                    title: 'Sener document', // required
                    path: '', // If you don't want the 'basic component' to be clickable and have a corresponding description, just set it to empty, or don't write it, and the link of the nav should not point to '/components/2.0/' but to '/components /2.0/catButton'
                    collapsable: false, // optional, whether the right sidebar is expanded, the default value is true
                    // If there are many components, it is recommended to put the children configuration in a js file separately, and then import it
                    children: docs,
                },
            ],
            '/guide/': [
                {
                    title: 'Start',
                    path: '',
                    collapsable: false,
                    children: [
                        {title: 'Introduction', path: 'intro'},
                        {title: 'Install and use', path: 'install'},
                        {title: 'Update log', path: 'version'},
                        // {title: 'Donate', path: 'donate'},
                    ],
                },
            ],
        },
        sidebarDepth: 1, // will also extract h2 in markdown and display it on the sidebar
        lastUpdated: 'Document update time', // Document update time: the last submission time of each file git
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
