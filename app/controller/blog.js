'use strict';
const Controller = require('egg').Controller;
class BlogController extends Controller {
    constructor(ctx) {
        super(ctx);
        this.blogContentRule = {
            queryAfter: { type: 'number', required: false },
            number: { type: 'number', required: false }
        };
        this.userBlogContentRule={
            id:{type:'number',required:true}
        }
    }
    //获取所有的博客信息
    async index() {
        const { ctx } = this;
        try {
            
            ctx.helper.toNumber(ctx.query);
            ctx.validate(this.blogContentRule, ctx.query);
            ctx.helper.xssFilter(ctx.query);
            ctx.body = await ctx.service.blog.getDefBlogContent(ctx.query);
        } catch (err) {
            // 参数验证失败
            if (err.code === 'invalid_param') {
                ctx.body = ctx.app.errorBlogContentParam();
                return;
            }
            ctx.body = ctx.app.errorBlogContent();
        }
    }
    //获取指定用户的博客信息
    async show() {
        const { ctx } = this;
        //ctx.body = ctx.params;
        try {
            ctx.helper.toNumber(ctx.query);
            ctx.helper.toNumber(ctx.params);
            
            ctx.validate(this.blogContentRule,ctx.query);
            ctx.validate(this.userBlogContentRule,ctx.params);
            ctx.helper.xssFilter(ctx.query);
            ctx.helper.xssFilter(ctx.params);
            ctx.body = await ctx.service.blog.getUsrBlogContent(ctx.params.id, ctx.query);
        } catch (err) {
            //参数验证失败
            if (err.code === 'invalid_param') {
                ctx.body = ctx.app.errorBlogContentParam();
                return;
            }
            ctx.body = ctx.app.errorBlogContent();
        }
    }
}
module.exports = BlogController;