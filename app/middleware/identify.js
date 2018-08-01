//身份验证
module.exports=()=>{
    return async function identify(ctx,next) {
        const {app}=ctx;
        if(ctx.method!=='GET'){
            let usable=await ctx.service.token.isTokenUsable();
            if(!usable){
                ctx.body=app.errorUserIdentify(app.config.ERROR_USER_IDENTIFY);
                return;
            }
        }
        await next();
    }
};