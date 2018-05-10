'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app; 
    router.resources('user', '/api/user', controller.user);
    router.resources('blog', '/api/blog', controller.blog);
    router.resources('blogContent', '/api/blogContent', controller.blogContent);
    router.resources('signIn', '/api/signIn', controller.signIn);
    router.resources('signUp', '/api/signUp', controller.signUp);
    router.resources('token', '/api/token', controller.token);
    router.resources('resources', '/api/'+app.config.sourceDir, controller.resources);
    router.resources('aa', '/api/aa', controller.aa);
};