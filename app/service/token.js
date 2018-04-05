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
        try {
            const {
                app,
                ctx
            } = this;
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
            let token;
            if(_token){token=_token;}else{
                token =this.getAccessToken();
            }
            if (token !== undefined) {
                let isUsable = await this._isTokenUsable(token);
                if (!isUsable) {
                    return false;
                }
                return true;
            }
            return false;
        } catch (err) {
            throw err;
        }
    }
    getAccessToken() {
        const {
            ctx
        } = this;
        return ctx.cookies.get('accessToken', {
            httpOnly: true,
            encrypt: true,
            signed: true
        });
    }
    async destroyAccessToken() {
        //使一个token失效(手动延时),但没有删除它
        const {
            app
        } = this;
        let token = this.getAccessToken();
        let time = new Date().getTime() - (app.config.tokenDelay) * 2;
        try {
            let result = await app.mysql.update('user_verify', {
                userUpdateAt: time
            }, {
                where: {
                    userAccessToken: token
                }
            });
            return result.affectedRows===1;
        } catch (err){
            throw err;
        }
    }
    async setAccessToken(valueID, key) {
        const {
            ctx
        } = this;
        try {
            const _token = await this.updateAccessToken(valueID, key)
            ctx.cookies.set('accessToken', _token, {
                httpOnly: true,
                encrypt: true,
                signed: true
            });
        } catch (err) {
            throw err;
        }
    }
    //测试用
    async demoGetAccessToken() {
        const {
            app,
            ctx
        } = this;
        return await app.mysql.select('user_verify', {
            where: {
                userID: 10010
            }
        });
    }
};
module.exports = TokenService;