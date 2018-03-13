'use strict';
const Controller = require('egg').Controller;
class UserController extends Controller {
    constructor(ctx) {
        super(ctx);
        this.createRule = {
            userPassword: 'string',
            userMail: 'string',
        };
        this.loginRule = {
            userPassword: 'string',
            userMail: 'string',
            accessToken: { type: 'string', required: false },
        };
        this.userInfoRule = {
            queryAfter: { type: 'number', required: false },
            number: { type: 'number', required: false }
        }
    }
    //个人数据
    async show() {
        const { ctx, app } = this;
        //---del 博客列表
        try {
            ctx.validate(this.userInfoRule);
            ctx.helper.xssFilter(ctx.params);
            ctx.helper.xssFilter(ctx.request.body);
            ctx.body = await ctx.service.user.getOwnInfo(ctx.params.id,ctx.request.body);
        } catch (err) {
            ctx.status = 400;
            ctx.body = ctx.helper.errorUserInfo();
        }
    }
    // async new() {}
    // add a user
    async create() {
        const { ctx } = this;
        try {
            ctx.validate(this.createRule);
            ctx.helper.verifyMail(ctx.request.body.userMail);
            ctx.helper.xssFilter(ctx.request.body);
            ctx.body = await ctx.service.user.create(ctx.request.body);
        } catch (err) {
            // 如果参数校验未通过，将会抛出一个 status = 422 的异常
            if (ctx.status === 422) {
                ctx.body = ctx.helper.errorUserFormate();
                return;
            }
            ctx.status = 400;
            // 邮箱格式不对
            if (err === this.app.config.status.ERROR_MAIL_FORMATE) {
                ctx.body = ctx.helper.errorMailFormate();
                return;
            }
            ctx.body = ctx.helper.errorUserCreate();
        }
    }
    // verify user [,login]
    async index() {
        const { ctx } = this;
        try {
            ctx.validate(this.loginRule);
            ctx.helper.verifyMail(ctx.request.body.userMail);
            ctx.helper.xssFilter(ctx.request.body);
            ctx.body = await ctx.service.user.login(ctx.request.body);
        } catch (err) {
            // 如果参数校验未通过，将会抛出一个 status = 422 的异常
            if (ctx.status === 422) {
                ctx.body = ctx.helper.errorUserFormate();
                return;
            }
            ctx.status = 400;
            // 邮箱格式不对
            if (err === this.app.config.status.ERROR_MAIL_FORMATE) {
                ctx.body = ctx.helper.errorMailFormate();
                return;
            }
            ctx.body = ctx.helper.errorUserLogin();
        }
    }
}
// async edit() {}
// change user's information
// async update() {}
// async destroy() {}
module.exports = UserController;