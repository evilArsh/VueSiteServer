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
// exports.cors={
//     enable:false,
//     package:'egg-cors'
// }
// had enabled by egg
// exports.static = true;
