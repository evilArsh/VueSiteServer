'use strict';

module.exports = appInfo => {
    const config = exports = {};
    config.client = {
        host: 'localhost',
        port: '8888',
        //附加信息
        query: {

        },
        app: true,
        agent: false
    }
    return config;
};
