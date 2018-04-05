'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1516894626558_8938';

  // add your config here
  config.middleware = [];
  // request body size
  config.bodyParser = {
    jsonLimit: '1mb',
    formLimit: '1mb',
  };
  config.mysql = {
    // mysql config
    client: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: 'wxl199657',
      database: 'web',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: true,
  };
//跨站白名单
  // session && cookie, (havn't been used)
  config.security = {
    csrf: {
      useSession: false, // 默认为 false，当设置为 true 时，将会把 csrf token 保存到 Session 中
      cookieName: '_csrf', // Cookie 中的字段名，默认为 csrfToken
      sessionName: '_csrf', // Session 中的字段名，默认为 csrfToken
      headerName: 'x-csrf-token',
      ignoreJSON:false
    },
    domainWhiteList: ['http://localhost:8080', 'http://localhost', 'http://localhost:80', 'http://127.0.0.1']
  };
  exports.cors = {
  //{string|Function} origin: '*',
  //{string|Array} allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  credentials:true
};
  // Nginx反向代理
  config.proxy = true;
  // JSONP CSRF验证
  config.jsonp = {
    csrf: true,
  };
  // token有效期,1小时
  config.tokenDelay = 3600000;
  //默认获取首页博客的数量
  config.defBlogNum=20;
  config.status = {
    ERROR_MAIL_FORMATE: 1,
    ERROR_TOKEN_HANDLE:2,
    ERROR_TOKEN_QUERY:3,
    ERROR_TOKEN_NOTUSABLE:4
  };
  config.info = {
    SUCCESS_USER_CREATE: '用户注册成功',
    SUCCESS_USER_LOGIN: '用户登录成功',
    SUCCESS_USER_INFO: '获取用户数据成功',
    SUCCESS_USER_BLOGCONTENT: '获取用户博客数据成功',
    SUCCESS_DEF_BLOGCONTENT:'获取博客数据成功',
    ERROR_MAIL_FORMATE: '邮箱格式不正确',
    ERROR_USER_CREATE: '用户注册失败',
    ERROR_USER_LOGIN: '用户名或密码错误',
    ERROR_USER_RELOGIN: '该用户已经登录',
    ERROR_USER_REGISTER: '此账号已被注册',
    ERROR_USER_LOGINOUT: '注销失败',
    SUCCESS_USER_LOGINOUT:'注销成功',
    ERROR_USER_FORMATE: '非法的用户名或密码',
    ERROR_USER_IDENTIFY:'用户身份已过期,请重新登录',
    ERROR_USER_INFO:'获取用户资料失败',
    //获取博客内容的请求参数中token格式不正确
    ERROR_BLOG_CONTENTPARAM:'access_token验证失败',
    ERROR_BLOG_CONTENT:'获取博客数据失败',
    //the error in handling database
    //WARNNING ! MUST CHANGE CONTENT WHEN IT IN PRODUCING ENV
    ERROR_DB_HANDLE:'数据库操作失败',
    ERROR_TOKEN_VERIFY: 'accessToken已失效',
    SUCCESS_TOKEN_VERIFY:'accessToken有效',
    ERROR_TOKEN_REQUIRE: '获取accessToken失败',
    SUCCESS_TOKEN_SET:'accessToken已发放',
  };
  return config;
};
