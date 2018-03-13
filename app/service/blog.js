'use strict';
const Service = require('egg').Service;
class BlogService extends Service {
    constructor(ctx) {
        super(ctx);
    }
    async getDefBlogContent(data) {
        const { ctx, app } = this;
        try {
            let { queryAfter, number } = ctx.helper.reqParamSet(data);
            // let p=await ctx.service.isTokenUsable();
            const result = await app.mysql.select('user_blog', {
                columns: ['blog_id', 'blog_title', 'blog_type', 'blog_time',  'blog_view', 'blog_content'],
                orders: [
                    ['blog_id', 'desc']
                ],
                limit: number,
                offset: queryAfter
            });
            return ctx.helper.successHandle(result);
        } catch (err) {
            throw err;
        }
    }
    async getUsrBlogContent(usr, data) {
        const { ctx ,app} = this;
        try {
            let { queryAfter, number } = ctx.helper.reqParamSet(data);
            const result = await app.mysql.select('user_blog', {
                where:{userID:usr},
                columns: ['blog_id', 'blog_title', 'blog_type', 'blog_time','blog_view', 'blog_content'],
                orders: [
                    ['blog_id', 'desc']
                ],
                limit: number,
                offset: queryAfter
            });
            return ctx.helper.successHandle(result);
        } catch (err) {
            // console.log(err)
            throw err;
        }
    }
}
module.exports = BlogService;