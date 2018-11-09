module.exports=()=>{
    return async function attachToken(ctx,next) {
        await next();
    }
};