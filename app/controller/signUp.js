'use strict';
const Controller = require('egg').Controller;
class SignUpController extends Controller {
    constructor(ctx) {
        super(ctx);
        this.createRule = {
            userPassword: 'string',
            userMail: 'string'
        };
    }
    // add a user
    async create() {
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
}
module.exports = SignUpController;