'use strict';
const Controller = require('egg').Controller;
class UserController extends Controller {
    constructor(ctx) {
        super(ctx);
        this.userInfoRule = {
            id:{type:'number',required:true}
        }
        this.updateRule = {
            userNickName:{type:'string',required:false}
        }
    }
    async index() {
        const { ctx, app } = this;
        ctx.body =await ctx.service.token.demoGetAccessToken();
    }
    //个人数据
    async show() {
        const { ctx, app } = this;
        try {
            ctx.helper.toNumber(ctx.params);
            ctx.validate(this.userInfoRule,ctx.params);
            ctx.helper.xssFilter(ctx.params);
            ctx.body = await ctx.service.user.getOwnInfo(ctx.params.id);
        } catch (err) {
            ctx.body = ctx.helper.errorUserInfo();
        }
    }
    //注销登录
    async destroy(){
        const{ctx}=this;
        try{
            ctx.helper.toNumber(ctx.params);
            ctx.validate(this.userInfoRule,ctx.params);
            ctx.helper.xssFilter(ctx.params);
            ctx.body=await ctx.service.user.loginOut(ctx.params);
        }catch(err){
            ctx.body = ctx.helper.errorUserLoginOut();
        }
    }
    //修改资料
    async update(){
        const{ctx}=this;
        try{
            ctx.helper.toNumber(ctx.params);
            ctx.validate(this.updateRule);
            ctx.validate(this.userInfoRule,ctx.params);
            ctx.helper.xssFilter(ctx.params);
            ctx.helper.xssFilter(ctx.request.body);
            ctx.body=await ctx.service.user.updateUser(ctx.params.id,ctx.request.body);
        }catch(err){
            console.log(err);
            
            ctx.body = ctx.helper.errorUserUpdate();
        }
    }
}
// async edit() {}
// change user's information
// async update() {}
// async destroy() {}
module.exports = UserController;