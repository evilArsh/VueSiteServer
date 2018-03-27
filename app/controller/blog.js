'use strict';
const Controller = require('egg').Controller;
class BlogController extends Controller {
    constructor(ctx) {
        super(ctx);
        this.blogContentRule = {
            queryAfter: { type: 'number', required: false },
            number: { type: 'number', required: false }
        };
        this.blogContentRuleSelf = {
            accessToken: { type: 'string', required: true },
            queryAfter: { type: 'number', required: true },
            number: { type: 'number', required: true }
        }
    }
    async index() {
        const { ctx } = this;
        try {
            ctx.validate(this.blogContentRule);
            ctx.helper.xssFilter(ctx.request.body);
            ctx.body = await ctx.service.blog.getDefBlogContent(ctx.request.body);
        } catch (err) {
            console.log(err)
            //参数验证失败
            if (ctx.status === 422) {
                ctx.body = ctx.helper.errorBlogContentParam();
                return;
            }
            ctx.body = ctx.helper.errorBlogContent();
        }
        //ctx.body='index method';
    }
    async show() {
        const { ctx } = this;
        //ctx.body = ctx.params;
        try {
            ctx.validate(this.blogContentRule);
            ctx.helper.xssFilter(ctx.request.body);
            ctx.helper.xssFilter(ctx.params);
            ctx.body=await ctx.service.blog.getUsrBlogContent(ctx.params.id,ctx.request.body);
        } catch (err) {
            //参数验证失败
            if (ctx.status === 422) {
                ctx.body = ctx.helper.errorBlogContentParam();
                return;
            }
            ctx.body = ctx.helper.errorBlogContent();
        }
    }
}
module.exports = BlogController;