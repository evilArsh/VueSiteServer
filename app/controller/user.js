'use strict';
const Controller = require('egg').Controller;
class UserController extends Controller {
    constructor(ctx) {
        super(ctx);
        this.userInfoRule = {
            id: { type: 'number', required: true }
        }
        this.tokenRule={
            accessToken: { type: 'string', required: true }
        }
        this.updateRule = {
            //其它字段待增加
            userNickName: { type: 'string', required: true }
        }
        this.loginRule = {
            userPassword: 'string',
            userMail: 'string'
            // accessToken: { type: 'string', required: false }
        }
        this.loginOutRule={
            accessToken: { type: 'string', required: true }
        }
        this.createRule = {
            userPassword: { type: 'string', required: true },
            userMail: { type: 'string', required: true },
            userCollege:{ type: 'string', required: true },
            userInstitution:{ type: 'string', required: true },
            userNickName:{ type: 'string', required: true },
            userIsTeacher:{ type: 'string', required: true }
        }
    }
    // add a user
    async register() {
        const { ctx } = this;
        try {
            console.log(ctx.request.body);

            ctx.validate(this.createRule);
            ctx.helper.verifyMail(ctx.request.body.userMail);
            ctx.helper.xssFilter(ctx.request.body);
            ctx.body = await ctx.service.user.register(ctx.request.body);
        } catch (err) {
            console.log(err)
            // 如果参数校验未通过，将会抛出一个 status = 422 的异常
            if (err.code === 'invalid_param') {
                ctx.body = ctx.app.errorUserFormate();
                return;
            }
            // 邮箱格式不对
            if (err === this.app.config.status.ERROR_MAIL_FORMATE) {
                ctx.body = ctx.app.errorMailFormate();
                return;
            }
            ctx.body = ctx.app.errorUserCreate();
        }
    }
    //登录
    async login() {
        const { ctx } = this;
        try {
            ctx.validate(this.loginRule);
            ctx.helper.verifyMail(ctx.request.body.userMail);
            ctx.helper.xssFilter(ctx.request.body);
            ctx.body = await ctx.service.user.login(ctx.request.body);
        } catch (err) {
            // 如果参数校验未通过，将会抛出一个 status = 422 的异常
            if (err.code === 'invalid_param') {
                ctx.body = ctx.app.errorUserFormate();
                return;
            }
            //邮箱格式不对
            if (err === this.app.config.status.ERROR_MAIL_FORMATE) {
                ctx.body = ctx.app.errorMailFormate();
                return;
            }
            ctx.body = ctx.app.errorUserLogin();
        }
    }
    //个人数据
    async getUser() {
        const { ctx, app } = this;
        try {
            ctx.helper.toNumber(ctx.params);
            ctx.validate(this.userInfoRule, ctx.params);
            ctx.helper.xssFilter(ctx.params);
            ctx.body = await ctx.service.user.getOwnInfo(ctx.params.id);
        } catch (err) {
            ctx.body = ctx.app.errorUserInfo();
        }
    }
    //注销登录
    async loginOut() {
        const { ctx } = this;
        try {
            ctx.validate(this.tokenRule,ctx.query);
            ctx.body = await ctx.service.user.loginOut();
        } catch (err) {
            // console.log(err);
            ctx.body = ctx.app.errorUserLoginOut();
        }
    }
    //修改资料
    async updateInfo() {
        const { ctx } = this;
        try {
            ctx.validate(this.tokenRule,ctx.query);
            ctx.validate(this.updateRule);
            ctx.helper.xssFilter(ctx.request.body);
            ctx.body = await ctx.service.user.updateUser(ctx.request.body);
        } catch (err) {
            ctx.body = ctx.app.errorUserUpdate();
        }
    }
}
module.exports = UserController;