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
    };
    config.cors={
    }
    return config;
}