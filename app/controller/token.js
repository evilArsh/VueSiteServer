'use strict';
const Controller = require('egg').Controller;
class TokenController extends Controller{
    constructor(ctx){
        super(ctx);
        this.tokenRule={
            accessToken:{type:'string',require:true}
        }
    }
    // /api/token?accessToken=
    async index(){
        const{ctx}=this;
        try{
            ctx.validate(this.tokenRule,ctx.query);
            let isToken = await ctx.service.token.isTokenUsable(ctx.query.accessToken);
            if(isToken){
                ctx.body = await ctx.service.user.getUserInfoByToken(ctx.query.accessToken);    
            }else{
                ctx.body = ctx.app.errorTokenVerify();    
            }
        }catch(err){
            ctx.body=ctx.app.errorTokenRequire();
        }
    }
};
module.exports = TokenController;