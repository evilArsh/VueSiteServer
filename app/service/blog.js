'use strict';
const Service = require('egg').Service;
class BlogService extends Service {
    constructor(ctx) {
        super(ctx);
    }
    //获取所有博客数据
    async getDefBlogContent(data) {
        const { ctx, app } = this;
        try {
            let { queryAfter, number } = ctx.helper.reqParamSet(data);
            // let p=await ctx.service.isTokenUsable();
            let sql=`SELECT 
            a.userNickName,
            b.blog_id,b.blog_title,b.blog_img,b.blog_type,b.blog_time,b.blog_view,b.blog_describe
            from user_verify as a,user_blog as b 
            where a.userID=b.userID
            order by b.blog_id desc
            limit ?,?
            `;
            const result=await app.mysql.query(sql,[queryAfter,number]);
            // const result = await app.mysql.select('user_blog', {
            //     columns: ['blog_id', 'blog_title', 'blog_type', 'blog_time',  'blog_view'],
            //     orders: [
            //         ['blog_id', 'desc']
            //     ],
            //     limit: number,
            //     offset: queryAfter
            // });
            return ctx.app.successDefBlog(result);
        } catch (err) {
            throw err;
        }
    }
    //获取指定用户数据
    async getUsrBlogContent(usr, data) {
        const { ctx ,app} = this;
        try {
            let { queryAfter, number } = ctx.helper.reqParamSet(data);
            const result = await app.mysql.select('user_blog', {
                where:{userID:usr},
                columns: ['blog_id', 'blog_title', 'blog_type', 'blog_time','blog_view'],
                orders: [
                    ['blog_id', 'desc']
                ],
                limit: number,
                offset: queryAfter
            });
            return ctx.app.successUserBlog(result);
        } catch (err) {
            // console.log(err)
            throw err;
        }
    }
}
module.exports = BlogService;