'use strict';
const Service = require('egg').Service;
class TokenService extends Service {
    constructor(ctx) {
        super(ctx);
    }
    async updateAccessToken(valueID, key) {
        const {
            app,
            ctx
        } = this;
        const conn = await app.mysql.beginTransaction();
        try {
            const time = (new Date()).getTime();
            const accessToken = app.createAccessToken(valueID, key, false);
            const sql = "update user_verify set userUpdateAt=?,userAccessToken=? where userID=?";
            const succ = await conn.query(sql, [time, accessToken, valueID]);
            await conn.commit();
            if (succ.affectedRows !== 1) {
                throw app.config.status.ERROR_TOKEN_HANDLE
            }
            return accessToken;
        } catch (err) {
            await conn.rollback();
            throw err;
        }
    }
    //内部函数
    async _isTokenUsable(token) {
        const {
            app,
            ctx
        } = this;
        try {
            //突发状况
            if (token === app.config.tokenFlag) {
                return false;
            }
            if(!token.length){
                return false;
            }
            let info = await app.mysql.select('user_verify', {
                where: {
                    userAccessToken: token
                },
                columns: ['userUpdateAt']
            });
            if (info.length === 1) {
                let over = ctx.helper.isTimeDelay(info[0].userUpdateAt, new Date().getTime());
                return over ? false : true;
            }
            //logger
            return false;
        } catch (err) {
            //logger
            throw app.config.status.ERROR_TOKEN_QUERY;
        }
    }
    //外部通用调用
    async isTokenUsable(_token) {
        try {
            let isUsable = await this._isTokenUsable(_token);
            return isUsable;
        } catch (err) {
            throw err;
        }
    }
    getAccessToken() {
        // const {
        //     ctx
        // } = this;
        // return ctx.cookies.get('accessToken', {
        //     httpOnly: true,
        //     encrypt: true,
        //     signed: true
        // });
    }
    async destroyAccessToken(token) {
        //使一个token失效(手动延时),设置延迟标志
        const {
            app,
            ctx
        } = this;
        let idT = await ctx.service.user.getUserIDByToken(token);

        let time = new Date().getTime() - (app.config.tokenDelay) * 2;
        try {
            let result = await app.mysql.update('user_verify', {
                userAccessToken: app.config.tokenFlag,
                userUpdateAt: time
            }, {
                    where: {
                        userID: idT.package.userID
                    }
                });
            return result.affectedRows === 1;
        } catch (err) {
            throw err;
        }
    }
    async setAccessToken(valueID, key) {
        const {
            ctx
        } = this;
        try {
            const _token = await this.updateAccessToken(valueID, key)
            return _token;
        } catch (err) {
            throw err;
        }
    }

    //测试用
    async demoMethod() {
        const {
            app,
            ctx
        } = this;
        return await app.mysql.select('user_verify', {
            where: {
                userID: 10013
            }
        });
    }
};
module.exports = TokenService;