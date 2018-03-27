'use strict';
const Service = require('egg').Service;
class UserService extends Service {
    async isUserNone(usrName) {
        const {
            app
        } = this;
        try {
            //judge whether user name has been registered
            let result = await app.mysql.select('user_verify', {
                where: {
                    userMail: usrName
                },
                columns: ['userMail']
            });
            return result.length === 0 ? true : false;
        } catch (err) {
            return false;
        }
    }
    async register(data) {
        const {
            ctx,
            app
        } = this;
        // const conn = await app.mysql.beginTransaction();
        let result = {};
        const timeO = new Date();
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
                userUpdateAt: timeO.getTime(),
                userNickName:'未设置昵称用户'
            });
            if (results.affectedRows === 1) {
                //cm
                await ctx.service.cm.setIdentify(data);
                //
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
        const {
            ctx,
            app
        } = this;
        let result = {};
        //数据库返回的结果
        let results = {};
        try {
            const token = ctx.service.token.getAccessToken();
            // the select function returns  an array like this [{},{}]
            results = await app.mysql.select('user_verify', {
                where: {
                    userMail: data.userMail,
                    userPassword: data.userPassword
                },
                columns: ['userID', 'userMail', 'userPassword', 'userAccessToken','userNickName','userAvatar','userIsAdmin'/*cm*/]
            });
            console.log('login service:' + JSON.stringify(results));
            // 用户名或密码错误
            // 加个Logger
            if (results.length !== 1) {
                result = ctx.helper.errorUserLogin();
            } else {
                if (token !== undefined && token === results[0].userAccessToken) {
                    let q = await ctx.service.token.isTokenUsable(results[0].userAccessToken);
                    if (q) {
                        return ctx.helper.errorUserReLogin();
                    }
                }
                ctx.rotateCsrfSecret();
                //cm
                let admin = results[0].userIsAdmin;
                let _admin;
                if (admin === "Y") { _admin = true; } else { _admin=false;}
                let info={
                    userNickName: results[0].userNickName,
                    userAvatar: results[0].userAvatar,
                    admin: _admin
                };
                //origional 
                await ctx.service.token.setAccessToken(results[0].userID, new Date().getTime());
                
                result = ctx.helper.successUserLogin(info);
                //origional 
                // result = ctx.helper.successUserLogin(info[0]);
            }
            return result;
        } catch (err) {
            throw err;
        }
    }
    //注销
    async loginOut() {
        //只对在有效期内的token进行注销
        const {
            ctx,
            app
        } = this;
        try {
            let usable = await ctx.service.token.isTokenUsable();
            if (usable) {
                let isDead = await ctx.service.token.destroyAccessToken();
                if (isDead) return ctx.helper.successUserLoginOut();
            }
            return ctx.helper.errorUserLoginOut();
        } catch (err) {
            throw err;
        }
    }
    async getOwnInfo(id, queryAndNumber) {
        const {
            ctx,
            app
        } = this;
        try {
            let {
                queryAfter,
                number
            } = ctx.helper.reqParamSet(queryAndNumber);
            let sql = `SELECT a.userNickName,a.userAvatar,b.blog_id,b.blog_type,b.blog_title,b.blog_time from user_info as a,user_blog as b where a.userID=b.userID AND a.userID=${id} ORDER BY b.blog_id DESC LIMIT ${queryAfter},${number} `;
            app.mysql.escape(sql);
            const result = await app.mysql.query(sql);
            return ctx.helper.successUserInfo(result);
        } catch (err) {
            throw err;
        }
    }
}
module.exports = UserService;