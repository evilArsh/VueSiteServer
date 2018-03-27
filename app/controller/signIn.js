'use strict';
const Controller = require('egg').Controller;
class SignInController extends Controller {
    constructor(ctx) {
        super(ctx);
        this.loginRule = {
            userPassword: 'string',
            userMail: 'string',
            accessToken: { type: 'string', required: false },
        };
    }
    //登录
    async create() {
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
            console.log(err);
            // 邮箱格式不对
            if (err === this.app.config.status.ERROR_MAIL_FORMATE) {
                ctx.body = ctx.helper.errorMailFormate();
                return;
            }
            ctx.body = ctx.helper.errorUserLogin();
        }
    }
}
module.exports = SignInController;