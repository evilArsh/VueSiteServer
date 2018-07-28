//微信创纪星空
'use strict';
const Controller = require('egg').Controller;
class CjxkController extends Controller {
    constructor(ctx) {
        super(ctx)
    }
    async index() {
        const { ctx,app } = this;
        try {
            const { signature,echostr, timestamp, nonce } = ctx.query;
            let arr=[app.config.TOKEN,timestamp,nonce].sort().join('');
            if(signature===ctx.helper.sha1(arr)){
                ctx.body=echostr;
            }else{
                ctx.body=false;
            }
        } catch (err) {
            ctx.logger.warn(err);
        }
    }
    async create(){
        const { ctx,app } = this;
        try {
            ctx.logger.info("wechat request body",ctx.request.body);
            ctx.logger.info("wechat request url",ctx.request.originalUrl);
        } catch (err) {
            ctx.logger.warn(err);
        }
    }
}
module.exports = CjxkController;