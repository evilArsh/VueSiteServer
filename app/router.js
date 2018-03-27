'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    // const jsonp=app.jsonp();
    const { router, controller } = app;
    //cm
    router.resources('cm','/api/cm', controller.cm);
    router.resources('user', '/api/user', controller.user);
    router.resources('signIn', '/api/signIn', controller.signIn);
    router.resources('signUp', '/api/signUp', controller.signUp);
    router.resources('blog', '/api/blog', controller.blog);
    router.resources('token', '/api/token', controller.token);
 
};