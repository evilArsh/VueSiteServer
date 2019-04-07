const SocketClient =require('./lib');
const assert = require('assert');
module.exports=app => {
    app.addSingleton('socketpc', createSocketClient);
}
function createSocketClient(config, app) {
    assert(config.host && config.port);
    const client = SocketClient(config);
    app.beforeStart(async () => {
        app.coreLogger.info(`[egg-socket-client] init instance success`);
    });

    return client;
}