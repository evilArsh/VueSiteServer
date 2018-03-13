'use strict';
const Service = require('egg').Service;
class TokenService extends Service {
    async updateAccessToken(vaule, key) {
        try {
            const { app, ctx } = this;
            const conn = await app.mysql.beginTransaction();
            const time = (new Date()).getTime();
            const accessToken = app.createAccessToken(value, key, true);
            const sql = "update user_verify set userUpdateAt=?,userAccessToken=? where userID=?";
            const succ = await conn.query(sql, [time, accessToken, _userID]);
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
    async _isTokenUsable(token) {
        try {
            const { app, ctx } = this;
            let info = await app.mysql.select('user_verify', {
                where: { userAccessToken: token },
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
    async isTokenUsable() {
        try {
            let token = this.getAccessToken();
            if (token !== undefined) {
                let isUsable = await this._isTokenUsable(token);
                if (!isUsable) {
                    return false;
                }
                return token;
            }
           return false;
        } catch (err) {
            throw err;
        }
    }
    getAccessToken() {
        const { ctx } = this;
        return ctx.cookies.get('accessToken', {
            httpOnly: true,
            encrypt: true,
            signed: true
        });
    }
    async setAccessToken(value, key) {
        try {
            const _token = await this.updateAccessToken(value, key)
            ctx.cookies.set('accessToken', _token, {
                httpOnly: true,
                encrypt: true,
                signed: true
            });
        } catch (err) {
            throw err;
        }
    }
};
module.exports = TokenService;