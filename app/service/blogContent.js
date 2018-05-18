'use strict';
const Service = require('egg').Service;
class BlogContentService extends Service {
    constructor(ctx) {
        super(ctx);
    }
    /**
     * 根据id 获取博客内容
     * @param {number} id blog id 
     */
    async getBlogContent(id) {
        const { ctx, app } = this;
        id = parseInt(id);
        try {
            let sql = `SELECT 
            a.userNickName,
            b.blog_content,b.blog_img,b.blog_title,b.blog_type,b.blog_time,b.blog_view 
            from user_verify as a,user_blog as b 
            where a.userID=b.userID and blog_id=?
            `;
            const result = await app.mysql.query(sql, [id]);
            // const result = await app.mysql.select('user_blog', {
            //     columns: ['blog_title','blog_describe','blog_type', 'blog_time',  'blog_view', 'blog_content'],
            //     where:{
            //         blog_id:id
            //     }
            // });
            return ctx.helper.successDefBlog(result);
        } catch (err) {
            throw err;
        }
    }
    /**
     * 创建一条博客内容
     * @param {JSON} data 需要属性{content,title,type} 
     */
    async createBlogContent(id, data) {
        const { ctx, app } = this;
        try {
            id=parseInt(id);
            let usable = await ctx.service.token.isTokenUsable();
            if (usable) {
                let idT = await ctx.service.user.getUserIDByToken();
                if (idT.package.userID === id) {
                    let userIDR = await ctx.service.user.getUserIDByToken();
                    const result = await app.mysql.insert('user_blog', {
                        userID: userIDR.package.userID,
                        blog_title: ctx.helper.xssFilter(data.title),
                        blog_type: ctx.helper.xssFilter(data.type),
                        blog_content: ctx.helper.shtml(data.content),
                        blog_img:data.img,
                        blog_describe: ctx.helper.xssFilter(data.describe),
                        blog_time: ctx.helper.dateFormate('yyyy-MM-dd hh:mm:ss', new Date())
                    });
                    if (result.affectedRows === 1) {
                        return ctx.helper.successBlogCreate();
                    }
                }
            }
            if (!usable) {
                return ctx.helper.errorUserIdentify(app.config.ERROR_USER_IDENTIFY);
            }
            return ctx.helper.errorBlogCreate();
        } catch (err) {
            throw err;
        }
    }
    /**
     * 根据id删除博客内容
     * @param {number} id 博客id 
     */
    async delBlogContent(id) {
        const { ctx, app } = this;
        id = parseInt(id);
        try {
            let usable = await ctx.service.token.isTokenUsable();
            if (!usable) {
                return ctx.helper.errorUserIdentify(app.config.ERROR_USER_IDENTIFY);
            }
            let userIDR = await ctx.service.user.getUserIDByToken();
            const result = await app.mysql.delete('user_blog', {
                where: {
                    userID: userIDR.package.userID,
                    blog_id: id
                }
            });
            if (result.affectedRows === 1) {
                return ctx.helper.successBlogDelete();
            }
            return ctx.helper.errorBlogDelete();
        } catch (err) {
            throw err;
        }
    }
    /**
     * 
     * @param {number} id 博客id 
     * @param {JSON} data {title,type,content}
     */
    async updateBlogContent(id, data) {
        const { ctx, app } = this;
        id = parseInt(id);
        try {
            let usable = await ctx.service.token.isTokenUsable();
            if (!usable) {
                return ctx.helper.errorUserIdentify(app.config.ERROR_USER_IDENTIFY);
            }
            let userIDR = await ctx.service.user.getUserIDByToken();
            const result = await app.mysql.update('user_blog', {
                blog_content: data.content,
                blog_title: data.title,
                blog_type: data.type
            }, {
                    where: {
                        userID: userIDR.package.userID,
                        blog_id: id
                    }
                });
            if (result.affectedRows === 1) {
                return ctx.helper.successBlogUpdate();
            }
            return ctx.helper.errorBlogUpdate();
        } catch (err) {
            throw err;
        }
    }
}
module.exports = BlogContentService;