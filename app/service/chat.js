'use strict';
const Service = require('egg').Service;
class ChatService extends Service {
    constructor(ctx) {
        super(ctx);
    }
    async getChatList(query) {
        const {
            app,
            ctx
        } = this;
        try {

            let { queryAfter, number } = ctx.helper.reqParamSet(query);
            queryAfter = parseInt(queryAfter);
            number = parseInt(number);
            const result = await app.mysql.select('a_chat', {
                columns: ['id', 'uri','userName', 'url', 'type', 'name', 'time', 'describe', 'commentNum'],
                orders: [
                    ['id', 'desc']
                ],
                limit: number,
                offset: queryAfter
            });
            return ctx.app.msg(true, '帖子列表数据', result);
        } catch (err) {

            throw err;
        }
    }
    async getChatItem(id) {
        const {
            app,
            ctx
        } = this;
        try {
            id = parseInt(id);
            let result = await app.mysql.select('a_chat', {
                columns: ['id', 'uri','url', 'userName', 'type', 'name', 'time', 'commentNum', 'content'],
                where: {
                    id: id
                }
            });
            return ctx.app.msg(true, '帖子数据', result[0]);
        } catch (err) {

            throw err;
        }
    }
    async postChatData(d) {
        const {
            app,
            ctx
        } = this;
        try {
            let rst = await app.mysql.insert('a_chat', {
                uri: d.uri.toString(),
                userName: d.userName,
                name: d.name,
                content: d.content,
                url: d.url,
                describe: d.describe,
                time: ctx.helper.dateFormate('yyyy-MM-dd', new Date())
            });
            if (rst.affectedRows === 1) {
                return ctx.app.msg(true, '发布成功')
            }
        } catch (err) {

            throw err;
        }
    }
};
module.exports = ChatService;