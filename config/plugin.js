'use strict';
const path = require('path');
exports.validate = {
  enable: true,
  package: 'egg-validate',
};
exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};
// md5
exports.md5 = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-md5'),
};
//egg-socket-client
exports.socketpc = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-socket-client'),
};
exports.cors={
    enable:true,
    package:'egg-cors'
}
exports.io = {
  enable: true,
  package: 'egg-socket.io',
};
// had enabled by egg
// exports.static = true;
