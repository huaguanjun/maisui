const sidebarConfig = require('./sidebar');
const navConfig = require('./nav');

module.exports = {
    title: 'MSUI指南',
    description: 'MSUI指南',
    port: 2334,

    smoothScroll: true,

    markdown: {
        lineNumbers: true
    },

    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    },

    themeConfig: {
        logo: '/img/logo.png',
        sidebar: 'auto',
        nav: navConfig,
        // displayAllHeaders: true
        lastUpdated: 'Last Updated'
    },

    configureWebpack: {
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': '/docs'
            }
        }
    }

};
