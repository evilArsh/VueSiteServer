'use strict';
const Service = require('egg').Service;
class UserService extends Service {
    async isUserNone(usrName) {
        const { app } = this;
        try {
            //judge whether user name has been registered
            let result = await app.mysql.select('user_verify', {
                where: { userMail: usrName },
                columns: ['userMail']
            });
            return result.length === 0 ? true : false;
        } catch (err) {
            return false;
        }
    }
    async create(data) {
        const { ctx, app } = this;
        // const conn = await app.mysql.beginTransaction();
        let result = {};
        const timeO = (new Date()).getTime();
        const time = ctx.helper.dateFormate('yyyy-MM-dd hh:mm:ss', timeO);
        try {
            let r = await this.isUserNone(data.userMail);
            if (!r) {
                return ctx.helper.errorUserRegister();
            }
            const results = await app.mysql.insert('user_verify', {
                userMail: data.userMail,
                userPassword: data.userPassword,
                userCreateAt: time,
                userUpdateAt: timeO,
            });
            if (results.affectedRows === 1) {
                result = ctx.helper.successUserCreate();
                // 是否创建accessToken
            } else {
                result = ctx.helper.errorUserCreate();
            }
            return result;
        } catch (err) {
           throw err;
        }
    }
    async login(data) {
        const { ctx, app } = this;
        let result = {};
        //数据库返回的结果
        let results = {};
        try {
            const token = ctx.service.token.getAccessToken();
            // 处理反复登录,登录的时候不应该有token,第一次登录会分配一个无法用js删除的token,
            // 即使被删除也只能手动删除,可以避免while(1)式恶意登录
            // 前端考虑加验证码之类的东西
            if (token !== undefined) {
                return ctx.helper.errorUserReLogin();
            }
            // the select function returns  an array like this [{},{}]
            results = await app.mysql.select('user_verify', {
                where: { userMail: data.userMail, userPassword: data.userPassword },
                columns: ['userID', 'userMail', 'userPassword']
            });
            // 用户名或密码错误
            // 加个Logger
            if (results.length !== 1) {
                result = ctx.helper.errorUserLogin();
            } else {
                let info = await app.mysql.select('user_info', {
                    where: { userID: results[0].userID },
                    columns: ['userNickName', 'userAvatar']
                });
                await ctx.sevice.token.setAccessToken(results[0].userID, new Date().getTime());
                ctx.rotateCsrfSecret();
                //更换成返回用户信息 ------------------------
                result = ctx.helper.successHandle(info[0]);
            }
            return result;
        } catch (err) {
            throw err;
        }
    }
    async getOwnInfo(id,queryAndNumber){
        const { ctx, app } = this;
        try{
            let { queryAfter, number } = ctx.helper.reqParamSet(queryAndNumber);
            let sql=`SELECT a.userNickName,a.userAvatar,b.blog_id,b.blog_type,b.blog_title,b.blog_time from user_info as a,user_blog as b where a.userID=b.userID AND a.userID=${id} ORDER BY b.blog_id DESC LIMIT ${queryAfter},${number} `;
            app.mysql.escape(sql);
            console.log(sql);
            const result=await app.mysql.query(sql);
            return ctx.helper.successHandle(result);
        }catch(err){
            throw err;
        }
    }
}
module.exports = UserService;