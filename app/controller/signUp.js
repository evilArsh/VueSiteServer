'use strict';
const Controller = require('egg').Controller;
class SignUpController extends Controller {
    constructor(ctx) {
        super(ctx);
        this.createRule = {
            userPassword: 'string',
            userMail: 'string',
        };
    }
    // add a user
    async create() {
        const { ctx } = this;
        try {
            ctx.validate(this.createRule);
            ctx.helper.verifyMail(ctx.request.body.userMail);
            ctx.helper.xssFilter(ctx.request.body);
            ctx.body = await ctx.service.user.register(ctx.request.body);
        } catch (err) {
            // 如果参数校验未通过，将会抛出一个 status = 422 的异常
            if (ctx.status === 422) {
                ctx.body = ctx.helper.errorUserFormate();
                return;
            }
            console.log(err)
            // 邮箱格式不对
            if (err === this.app.config.status.ERROR_MAIL_FORMATE) {
                ctx.body = ctx.helper.errorMailFormate();
                return;
            }
            ctx.body = ctx.helper.errorUserCreate();
        }
    }
}
module.exports = SignUpController;