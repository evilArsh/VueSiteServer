'use strict';
const Controller = require('egg').Controller;
class UserController extends Controller {
    constructor(ctx) {
        super(ctx);
        this.userInfoRule = {
            queryAfter: { type: 'number', required: false },
            number: { type: 'number', required: false }
        }
    }
    async index() {
        const { ctx, app } = this;
        ctx.body =await ctx.service.token.demoGetAccessToken();
    }
    //个人数据
    async show() {
        const { ctx, app } = this;
        //---del 博客列表
        try {
            ctx.validate(this.userInfoRule);
            ctx.helper.xssFilter(ctx.params);
            ctx.helper.xssFilter(ctx.request.body);
            ctx.body = await ctx.service.user.getOwnInfo(ctx.params.id, ctx.request.body);
        } catch (err) {
            ctx.status = 400;
            ctx.body = ctx.helper.errorUserInfo();
        }
    }
}
// async edit() {}
// change user's information
// async update() {}
// async destroy() {}
module.exports = UserController;