'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app; 
    //---核心组件
    router.post('/api/signIn',controller.user.login);
    router.post('/api/signUp',controller.user.register);
    router.get('/api/user/:id',controller.user.getUser);
    router.delete('/api/user',controller.user.loginOut);
    router.put('/api/user',controller.user.updateInfo);
    router.resources('token', '/api/token', controller.token);
    router.resources('resources', '/api/'+app.config.sourceDir, controller.resources);
    //---案例
    router.resources('course','/api/course',controller.course);
    router.resources('chat','/api/chat',controller.chat);
    //---测试用
    router.get('test','/api/demo',controller.demo.index);

};