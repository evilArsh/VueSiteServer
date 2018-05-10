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
      password: '',
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
      ignoreJSON: false
    },
    domainWhiteList: ['http://localhost:8080', 'http://localhost', 'http://localhost:80', 'http://127.0.0.1']
  };
  exports.cors = {
    //{string|Function} origin: '*',
    //{string|Array} allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    credentials: true
  };
  // Nginx反向代理
  config.proxy = false;
  // JSONP CSRF验证
  config.jsonp = {
    csrf: true,
  };
  //token失效标志
  config.tokenFlag = "unavailable";
  //资源目录名字
  config.sourceDir = 'resources';
  // token有效期,三天
  config.tokenDelay = 259200000;
  //egg-multipart
  config.multipart = {
    // fileExtensions:[]
    fileSize: '5mb',
    whitelist: [
      '.jpg', '.jpeg',
      '.png', 
      '.gif',
      '.bmp',
      '.wbmp',
      '.webp',
      '.tif'
    ],
  };
  //默认获取首页博客的数量
  config.defBlogNum = 20;
  config.status = {
    ERROR_MAIL_FORMATE: 1,
    ERROR_TOKEN_HANDLE: 2,
    ERROR_TOKEN_QUERY: 3,
    ERROR_TOKEN_NOTUSABLE: 4
  };
  config.info = {
    //用户
    SUCCESS_USER_CREATE: '用户注册成功',
    SUCCESS_USER_LOGIN: '用户登录成功',
    ERROR_MAIL_FORMATE: '邮箱格式不正确',
    ERROR_USER_CREATE: '用户注册失败',
    ERROR_USER_LOGIN: '用户名或密码错误',
    ERROR_USER_RELOGIN: '该用户已经登录',
    ERROR_USER_REGISTER: '此账号已被注册',
    ERROR_USER_LOGINOUT: '注销失败',
    SUCCESS_USER_LOGINOUT: '注销成功',
    ERROR_USER_FORMATE: '非法的用户名或密码',
    ERROR_USER_IDENTIFY: '用户身份已过期,请重新登录',
    SUCCESS_USER_INFO: '获取用户数据成功',
    ERROR_USER_INFO: '获取用户数据失败',
    ERROR_USER_UPDATE: '修改失败',
    SUCCESS_USER_UPDATE: '修改成功',
    ERROR_USER_AVATAR: '头像上传失败',
    SUCCESS_USER_AVATAR: '头像上传成功',

    ERROR_DB_HANDLE: '数据操作异常',
    ERROR_BLOG_CONTENTPARAM: '请求参数格式错误',

    //博客
    SUCCESS_USER_BLOGCONTENT: '获取用户博客数据成功',
    SUCCESS_DEF_BLOGCONTENT: '获取博客数据成功',
    ERROR_BLOG_CONTENT: '获取博客数据失败',
    ERROR_BLOG_CREATE: '博客发布失败',
    SUCCESS_BLOG_CREATE: '博客发布成功',
    ERROR_BLOG_DELETE: '博客删除失败',
    SUCCESS_BLOG_DELETE: '博客删除成功',

    //AccessToken
    ERROR_TOKEN_VERIFY: '用户身份已过期,请重新登录',
    SUCCESS_TOKEN_VERIFY: 'AccessToken有效',
    ERROR_TOKEN_REQUIRE: '获取AccessToken失败',
    SUCCESS_TOKEN_SET: 'AccessToken已发放',
  };
  return config;
};
