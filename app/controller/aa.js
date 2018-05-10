'use strict';
const Controller = require('egg').Controller;
class AAController extends Controller {
    constructor(ctx) {
        super(ctx);
    }
    //参数?func=''?
    //万能函数=_=
    async create() {
        const {
            ctx,
            app
        } = this;
        try {

            let result;
            ctx.helper.xssFilter(ctx.query);
            ctx.helper.xssFilter(ctx.request.body);
            let func = ctx.query.func;
            switch (func) {
                case "setMsg": ctx.body = await ctx.service.aa.upLoadMsg(ctx.query); break;
                case "userUpload": ctx.body = await ctx.service.aa.userUpload(ctx.query); break;
                case "addBoard": ctx.body = await ctx.service.aa.addBoard(ctx.request.body); break;
                case "addBoardReply": ctx.body = await ctx.service.aa.addBoardReply(ctx.request.body); break;
                case "starBoard": ctx.body = await ctx.service.aa.starBoard(ctx.request.body); break;
                case "starBoardReply": ctx.body = await ctx.service.aa.starBoardReply(ctx.request.body); break;
                case "delBoard": ctx.body = await ctx.service.aa.delBoard(ctx.request.body); break;
                case "delBoardReply": ctx.body = await ctx.service.aa.delBoardReply(ctx.request.body); break;
                case "delProject": ctx.body = await ctx.service.aa.delProject(ctx.request.body); break;
                case "sendUserBoard": ctx.body = await ctx.service.aa.sendUserBoard(ctx.request.body); break;
                case "delUserBoard": ctx.body = await ctx.service.aa.delUserBoard(ctx.request.body); break;
                case "delProjectU": ctx.body = await ctx.service.aa.delProjectU(ctx.request.body); break;
                case "sendReply": ctx.body = await ctx.service.aa.sendReply(ctx.request.body); break;
                case "check": ctx.body = await ctx.service.aa.check(ctx.request.body); break;
                case "change": ctx.body = await ctx.service.aa.change(ctx.request.body); break;
                case "updateUserInfo": ctx.body = await ctx.service.aa.updateUserInfo(ctx.request.body); break;
                case "updateSecret": ctx.body = await ctx.service.aa.updateSecret(ctx.request.body); break;
                case "delOwnP": ctx.body = await ctx.service.aa.delOwnP(ctx.request.body); break;
                default:
                    ctx.body = {success:false,data:'请求出错'};
            }
        } catch (err) {
            console.log(err);

            ctx.body = {success:false,data:'请求出错'};
        }
    }
    async index(){
        const {
            ctx,
            app
        } = this;
        try {

            let result;
            let func = ctx.query.func;
            ctx.helper.xssFilter(ctx.params.id)
            switch (func) {
                case "getMsg": ctx.body = await ctx.service.aa.getMsg(ctx.query); break;
                case "getContent": ctx.body = await ctx.service.aa.getContent(ctx.query.id); break;
                case "fileManage": ctx.body = await ctx.service.aa.fileManage(ctx.query); break;
                case "getFiles": ctx.body = await ctx.service.aa.getFiles(ctx.query); break;
                case "getBoard": ctx.body = await ctx.service.aa.getBoard(ctx.query); break;

                case "getUserBoard": ctx.body = await ctx.service.aa.getUserBoard(ctx.query); break;
                case "getUserBoardA": ctx.body = await ctx.service.aa.getUserBoardA(ctx.query); break;

                case "getBoardReply": ctx.body = await ctx.service.aa.getBoardReply(ctx.query); break;
                case "getUserData": ctx.body = await ctx.service.aa.getUserData(ctx.query); break;
                case "getInfo": ctx.body = await ctx.service.aa.getInfo(); break;
                case "getOwnProj": ctx.body = await ctx.service.aa.getOwnProj(ctx.query); break;
                
                default:
                    ctx.body = "{success:false,data:'请求出错'}";
            }
        } catch (err) {
            console.log(err);

            ctx.body = "{success:false,data:'请求出错'}";
        }
    }

}
module.exports = AAController;