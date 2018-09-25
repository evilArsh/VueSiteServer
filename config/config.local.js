'use strict';

module.exports = appInfo => {
    const config = exports = {};
    config.mysql = {
        // mysql config
        client: {
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: 'mysql123456',
            database: 'web',
        },
        // 是否加载到 app 上，默认开启
        app: true,
        // 是否加载到 agent 上，默认关闭
        agent: true,
    };
    // Nginx反向代理
    config.proxy = false;
    //跨站白名单
    // session && cookie, (havn't been used)
    config.security = {
        csrf:{
            enable:false
        }
        // csrf: {
        //     useSession: false, // 默认为 false，当设置为 true 时，将会把 csrf token 保存到 Session 中
        //     cookieName: '_csrf', // Cookie 中的字段名，默认为 csrfToken
        //     sessionName: '_csrf', // Session 中的字段名，默认为 csrfToken
        //     headerName: 'x-csrf-token',
        //     ignoreJSON: false
        // },
        // domainWhiteList: ['http://localhost:8080', 'http://localhost', 'http://localhost:80', 'http://127.0.0.1']
        // // domainWhiteList:/^https?:\/\/[\w+]/
    };
    config.cors={
    }
    return config;
}