'use strict';
const Controller = require('egg').Controller;
class TokenController extends Controller{
    constructor(ctx){
        super(ctx);
        this.tokenRule={
            accessToken:{type:'string',require:true}
        }
    }
    async index(){
        const{ctx}=this;
        try{
            let isToken = await ctx.service.token.isTokenUsable();
            if(isToken){
                ctx.body = await ctx.service.user.getUserInfoByToken();    
            }else{
                ctx.body = ctx.app.errorTokenVerify();    
            }
        }catch(err){
            ctx.body=ctx.app.errorTokenRequire();
        }
    }
};
module.exports = TokenController;