'use strict';
const Controller = require('egg').Controller;
class CommentController extends Controller {
    constructor(ctx) {
        super(ctx);
    }
    async index() {
        const { ctx } = this;
        try {
            ctx.body = await ctx.service.music.getComment(ctx.query.id); 
        } catch (err) {
            console.log(err)
            ctx.body = ctx.helper.msg(false, `comment index param error`);
        }
    }

    async show() {
        const { ctx } = this;
        try {
        } catch (err) {
            console.log(err)
            ctx.body = ctx.helper.msg(false, `comment single param error`);
        }
    }
    async create() {
        const { ctx } = this;
        try {
            ctx.body=await  ctx.service.music.createComment(ctx.request.body);

        } catch (err) {
            
            console.log(err)
            ctx.body = ctx.helper.msg(false, `comment create param error`);
        }


    }
    async destroy() {
        const { ctx } = this;
        try {
         
        } catch (err) {
            console.log(err)
            ctx.body = ctx.helper.msg(false, `comment delete param error`);
        }


    }
    async update() {
        const { ctx } = this;
        try {
            const { ctx } = this;
            try {

               
            } catch (err) {
                console.log(err)
                ctx.body = ctx.helper.msg(false, `comment update param error`);
            }
        } catch (err) {

        }
    }
 
}
module.exports= CommentController;