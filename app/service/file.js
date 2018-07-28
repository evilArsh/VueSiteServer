'use strict';
const Service = require('egg').Service;
const path = require('path');
const fs = require('fs');
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
class FileService extends Service {
    constructor(ctx) {
        super(ctx);
    }
    async upLoadImg(id) {
        const {
            ctx,
            app
        } = this;
        id = parseInt(id);
        try {
            let usable = await ctx.service.token.isTokenUsable();
            if (usable) {
                let idT = await ctx.service.user.getUserIDByToken();
                if (idT.package.userID === id) {
                    let uri=await this._upLoadImg();
                    const result=await app.mysql.update('user_verify',{
                        url:uri
                    },{
                        where:{
                            userID:id
                        }
                    });
                    if(result.affectedRows===1){
                        return ctx.app.successUserAvatar(uri);
                    }
                }
            }
            return ctx.app.errorUserAvatar();

        } catch (err) {
            throw err;
        }
    }
    async _upLoadImg() {
        const {
            ctx,
            app
        } = this;
        let URI = '';
        const parts = ctx.multipart({ autoFields: true });
        let part;
        try {
            while ((part = await parts()) !== null) {
                if (typeof part === 'object' && 'undefined' !== typeof part.filename) {
                    const fn = app.md5(part.filename.toLowerCase(), new Date(), false) + part.filename.substr(part.filename.lastIndexOf('.'));
                    URI = path.join('/', fn);
                    const target = path.join(this.config.baseDir, app.config.sourceDir, fn);
                    const writeStream = fs.createWriteStream(target);
                    await awaitWriteStream(part.pipe(writeStream));
                }
                if (typeof part !== 'object') break;
            }
            return URI;
        } catch (err) {
            if (typeof part === 'object') {
                await sendToWormhole(part);
            }
            throw err;
        }
    }
};
module.exports = FileService;