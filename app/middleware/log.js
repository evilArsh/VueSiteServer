module.exports=()=>{
    return async function log(ctx,next) {
        let {ip,method,originalUrl}=ctx.request;
        let {realStatus}=ctx.response;
        let agent=ctx.request.header['user-agent'];
        ctx.logger.info(ip,method,originalUrl,realStatus,agent)
        await next();
    }
};