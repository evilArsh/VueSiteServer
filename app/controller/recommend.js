'use strict';
const Controller = require('egg').Controller;
class RecommendController extends Controller {
    //参数 func type queryAfter number
    constructor(ctx) {
        super(ctx);
    }
    async index() {
    }

    async show() {
    }
    async create() {

    }
    async destroy() {

    }
    async update() {
        const { ctx } = this;
        try {
            ctx.body = await ctx.service.music.toggleRecommend(ctx.params.id,ctx.query.index);
        } catch (err) {
            console.log(err)
            ctx.body=ctx.helper.msg(false, `recommend update error`);
       
        }

    }
}
module.exports = RecommendController;