'use strict';
const Controller = require('egg').Controller;
class MusicController extends Controller {
    //参数 func type queryAfter number
    constructor(ctx) {
        super(ctx);
    }
    async index() {
        const { ctx } = this;
        try {
            let func = ctx.query.func;
            switch (func) {
                case 'recommend': ctx.body = await ctx.service.music.getRecommend(ctx.query.queryAfter, ctx.query.number); break;
                case 'hot': ctx.body = await ctx.service.music.getHot(ctx.query.number); break;
                case 'new': ctx.body = await ctx.service.music.getNew(ctx.query.number); break;
                case 'music': ctx.body = await ctx.service.music.getMusic(ctx.query.type, ctx.query.queryAfter, ctx.query.number); break;
                default: ctx.body = ctx.helper.msg(false, `music index param error`); break;
            }
        } catch (err) {
            console.log(err)
            ctx.body = ctx.helper.msg(false, `music index param error`);
        }
    }

    async show() {
        const { ctx } = this;
        try {
            ctx.body = await ctx.service.music.getMusicContent(ctx.params.id)
        } catch (err) {
            console.log(err)
            ctx.body = ctx.helper.msg(false, `music single param error`);
        }
    }
    async create() {
        const { ctx } = this;
        try {
            ctx.body=await  ctx.service.music.createMusic(ctx.request.body);
        } catch (err) {
            console.log(err)
            ctx.body = ctx.helper.msg(false, `music create param error`);
        }


    }
    async destroy() {
        const { ctx } = this;
        try {
            let func = ctx.query.func;
            switch (func) {
                case 'recommend': ctx.body = await ctx.service.music.toggleRecommend(ctx.params.id, 'n'); break;
                case 'music': ctx.body = await ctx.service.music.delMusic(ctx.params.id); break;
                default: ctx.body = ctx.helper.msg(false, `music delete param error`); break;
            }
        } catch (err) {
            console.log(err)
            ctx.body = ctx.helper.msg(false, `music delete param error`);
        }


    }
    async update() {
        const { ctx } = this;
        try {
            const { ctx } = this;
            try {

                ctx.body = await ctx.service.music.updateMusic(ctx.params.id, ctx.request.body);
            } catch (err) {
                console.log(err)
                ctx.body = ctx.helper.msg(false, `music update param error`);
            }
        } catch (err) {

        }
    }
    async addPlayNum(){
        const { ctx } = this;
        try {
            const { ctx } = this;
            try {
                await ctx.service.music.addPlayNum(ctx.query.id);
                ctx.body={}
            } catch (err) {
                console.log(err)
                ctx.body = ctx.helper.msg(false, ``);
            }
        } catch (err) {

        }
    }
}
module.exports = MusicController;