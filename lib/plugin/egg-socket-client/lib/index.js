"use strict";
const io=require('socket.io-client');
// import io from 'socket.io-client';
function _resolveHost(host, port) {
    if (!/http[s]?:\/\//.test(host)) {
        host = "http://" + host;
    }
    host = host + ":" + port;
    return host;
}
module.exports=config=> {
    let host=_resolveHost(config.host,config.port);
    let query=config.hasOwnProperty("query")?config.query:{};
    return io(host,query);
}
// export default class SocketClient{
//     constructor(config){
//         this.host=config.host;
//         this.port=config.port;
//         this.query=config.hasOwnProperty("query")?config.query:{};
//         this.socket=null;
//         this._init(host,port,query);
//     }
//     _init(host,port,query){
//         if(!/http[s]?:\/\//.test(host)){
//             host="http://"+host+":"+port;
//         }
//         this.socket=io(host,query);
//     }
// }