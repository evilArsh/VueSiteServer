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
            ctx.body=isToken?ctx.helper.successTokenVerify():ctx.helper.errorTokenVerify();
        }catch(err){
            ctx.body=ctx.helper.errorTokenRequire();
        }
    }
};
module.exports = TokenController;