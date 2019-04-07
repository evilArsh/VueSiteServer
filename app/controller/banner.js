'use strict';
const Controller = require('egg').Controller;
class BannerController extends Controller {
    constructor(ctx) {
        super(ctx);
    }
    async index() {
        const { ctx } = this;
        try {
            ctx.body = await ctx.service.music.getBanner();
        } catch (err) {
            console.log(err)
            ctx.body=ctx.helper.msg(false, `banner param error`);
       
        }
    }

    async show() {
        const { ctx } = this;
        try {

        } catch (err) {

        }
    }
    async create() {
        const { ctx } = this;
        try {

        } catch (err) {

        }
    }
    async destroy() {
        const { ctx } = this;
        try {
            ctx.body = await ctx.service.music.toggleBanner(ctx.params.id,'n');
        } catch (err) {
            console.log(err)
            ctx.body=ctx.helper.msg(false, `banner destroy error`);
       
        }

    }
    async update() {
        const { ctx } = this;
        try {
            console.log(ctx.query.index)
            ctx.body = await ctx.service.music.toggleBanner(ctx.params.id,ctx.query.index);
        } catch (err) {
            console.log(err)
            ctx.body=ctx.helper.msg(false, `banner update error`);
       
        }
    }
}
module.exports = BannerController;