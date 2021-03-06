'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller ,io} = app; 
    //---核心组件
    router.post('/api/signIn',controller.user.login);
    //router.post('/api/signUp',controller.user.register);
    router.get('/api/user/:id',controller.user.getUser);
    router.delete('/api/user',controller.user.loginOut);
    router.put('/api/user',controller.user.updateInfo);
    router.resources('token', '/api/token', controller.token);
    router.resources('resources', '/api/'+app.config.sourceDir, controller.resources);
    //---案例
    router.resources('blog', '/api/blog', controller.blog);
    router.resources('blogContent', '/api/blogContent', controller.blogContent);
    router.resources('banner','/api/banner',controller.banner);
    router.get('count','/api/count',controller.music.addPlayNum);
    router.resources('music','/api/music',controller.music);
    router.resources('recommend','/api/recommend',controller.recommend);
    router.resources('sign_comment','/api/sign_comment',controller.comment);
    //socket
    io.of('/').route('req', io.controller.nsp.req);

    //---测试用
    router.get('test','/api/demo',controller.demo.index);

};