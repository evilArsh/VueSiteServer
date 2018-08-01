'use strict';
const Controller = require('egg').Controller;
class BlogContentController extends Controller {
    constructor(ctx) {
        super(ctx);
        this.createRule = {
            content: { type: 'string', required: true },
            title: { type: 'string', required: true },
            type: { type: 'string', required: true },
            describe:{type:'string',required:false},
            img:{type:'string',required:false,allowEmpty:true}
        };
        this.idRule={
            id:{type:'number',required:true}
        };
    }
    // async index() {
    //     const { ctx } = this;
    //     try {

    //     } catch (err) {
    //         // 参数验证失败
    //         if (err.code === 'invalid_param') {
    //             ctx.body = ctx.app.errorBlogContentParam();
    //             return;
    //         }
    //         ctx.body = ctx.app.errorBlogContent();
    //     }
    // }

    //获取某条博客的内容
    async show() {
        const { ctx } = this;
        try {
            ctx.helper.toNumber(ctx.params);
            ctx.validate(this.idRule,ctx.params)
            ctx.helper.xssFilter(ctx.params);
            ctx.body = await ctx.service.blogContent.getBlogContent(ctx.params.id)
        } catch (err) {
            
            //参数验证失败
            if (err.code === 'invalid_param') {
                ctx.body = ctx.app.errorBlogContentParam();
                return;
            }
            ctx.body = ctx.app.errorBlogContent();
        }
    }
    //创建一条博客内容
    async create() {
        const { ctx } = this;
        try {
            ctx.validate(this.createRule);
            ctx.body = await ctx.service.blogContent.createBlogContent(ctx.request.body);
        } catch (err) {
            console.log(err);
            
            //参数验证失败
            if (err.code === 'invalid_param') {
                ctx.body = ctx.app.errorBlogContentParam();
                return;
            }
            ctx.body = ctx.app.errorBlogCreate();
        }
    }
    //删除一条博客
    async destroy() {
        const { ctx } = this;
        try {
            ctx.helper.toNumber(ctx.params);
            ctx.validate(this.idRule,this.params)
            ctx.body = await ctx.service.blogContent.delBlogContent(ctx.params.id);
        } catch (err) {
            //参数验证失败
            if (err.code === 'invalid_param') {
                ctx.body = ctx.app.errorBlogContentParam();
                return;
            }
            ctx.body = ctx.app.errorBlogDelete();
        }

    }
    //修改一条博客
    async update() {
        const { ctx } = this;
        try {
            ctx.validate(this.idRule,this.params);
            ctx.helper.xssFilter(ctx.request.body);
            ctx.body = await ctx.service.blogContent.updateBlogContent(ctx.params.id,ctx.request.body);
        } catch (err) {
            //参数验证失败
            if (err.code === 'invalid_param') {
                ctx.body = ctx.app.errorBlogContentParam();
                return;
            }
            ctx.body = ctx.app.errorBlogUpdate();
        }

    }
}
module.exports = BlogContentController;