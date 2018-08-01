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
    //注册
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
                return ctx.app.errorUserRegister();
            }

            const results = await app.mysql.insert('user_verify', {
                userMail: data.userMail,
                userPassword: data.userPassword,
                userCreateAt: time,
                userUpdateAt: timeO.getTime(),
                userNickName: '未设置昵称',
                userIsAdmin: 'N',
                userPhone: data.userPhone
            });
            if (results.affectedRows === 1) {
                result = ctx.app.successUserCreate();
                // 是否创建accessToken
            } else {
                result = ctx.app.errorUserCreate();
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
                columns: ['userID', 'userMail', 'userPassword', 'userAccessToken', 'userNickName', 'url']
            });
            // 用户名或密码错误
            // 加个Logger
            if (results.length !== 1) {
                result = ctx.app.errorUserLogin();
            } else {
                if (token !== undefined && token === results[0].userAccessToken) {
                    let q = await ctx.service.token.isTokenUsable(results[0].userAccessToken);
                    if (q) {
                        return ctx.app.errorUserReLogin();
                    }
                }
                ctx.rotateCsrfSecret();
                //origional 
                await ctx.service.token.setAccessToken(results[0].userID, new Date().getTime());
                let info = {
                    userID: results[0].userID,
                    userMail: results[0].userMail,
                    userNickName: results[0].userNickName,
                    url: results[0].url
                }
                result = ctx.app.successUserLogin(info);
                //origional 
                // result = ctx.app.successUserLogin(info[0]);
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
            let isDead = await ctx.service.token.destroyAccessToken();
            if (isDead) return ctx.app.successUserLoginOut();
            return ctx.app.errorUserLoginOut();
        } catch (err) {
            throw err;
        }
    }
    async getOwnInfo(id) {
        const {
            ctx,
            app
        } = this;
        try {
            id = parseInt(id);
            let sql = `SELECT userID,userNickName,url from user_verify where userID=${id}`;
            const result = await app.mysql.query(sql);
            return ctx.app.successUserInfo(result);
        } catch (err) {
            throw err;
        }
    }
    async updateUser(data) {
        const {
            ctx,
            app
        } = this;
        try {
            let idT = await this.getUserIDByToken();
            const result = await app.mysql.update('user_verify', {
                userNickName: data.userNickName
            }, {
                    where: {
                        userID: idT.package.userID
                    }
                });
            if (result.affectedRows === 1) {
                return ctx.app.successUserUpdate();
            }
            return ctx.app.errorUserUpdate();
        } catch (err) {
            throw err;
        }
    }
    //++++++
    async getUserInfoByToken() {
        const {
            ctx,
            app
        } = this;
        const token = await ctx.service.token.getAccessToken();
        try {
            let result = await app.mysql.select('user_verify', {
                columns: ['userNickName', 'url', 'userMail', 'userID', 'userIsAdmin'],
                where: {
                    userAccessToken: token
                }
            });
            if (result.length) {
                return ctx.app.successUserInfo(result[0]);
            }
            return ctx.app.errorUserInfo();
        } catch (err) {
            throw err;
        }
    }
    //++++++
    //
    async getUserIDByToken() {
        const {
            ctx,
            app
        } = this;
        const token = await ctx.service.token.getAccessToken();
        try {
            let result = await app.mysql.select('user_verify', {
                columns: ['userID'],
                where: {
                    userAccessToken: token
                }
            });
            if (result.length) {
                return ctx.app.successUserInfo(result[0]);
            }
            return ctx.app.errorUserInfo();
        } catch (err) {
            throw err;
        }
    }
}
module.exports = UserService;