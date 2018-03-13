'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    // const jsonp=app.jsonp();
    const { router, controller } = app;
    router.resources('user', '/api/user', controller.user);
    router.resources('blog', '/api/blog', controller.blog);
};