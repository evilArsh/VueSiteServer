'use strict';
const Controller = require('egg').Controller;
class ChatController extends Controller {
    constructor(ctx) {
        super(ctx);

    }
    // /api/chat?queryAfter=?&number=?
    async index() {
        const { ctx, app } = this;
        try {
            ctx.body = await ctx.service.chat.getChatList(ctx.query);
        } catch (err) {
            console.log(err)
            ctx.body = ctx.app.msg(false, '获取失败')
        }
    }
    async show() {
        const { ctx, app } = this;
        try {
            ctx.body = await ctx.service.chat.getChatItem(ctx.params.id);
        } catch (err) {
            console.log(err)
            ctx.body = ctx.app.msg(false, '获取失败')
        }
    }
    async create() {
        const { ctx, app } = this;
        try {
            ctx.body = await ctx.service.chat.postChatData(ctx.request.body);
        } catch (err) {
            console.log(err)
            ctx.body = ctx.app.msg(false, '发布失败')
        }
    }
};
module.exports = ChatController;