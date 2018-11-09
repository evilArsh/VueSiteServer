//身份验证
module.exports = () => {
    return async function identify(ctx, next) {
        if (ctx.method !== 'GET') {
            let token = ctx.request.query.accessToken;
            if (typeof token !== 'string') {
                ctx.body = {
                    success: false,
                    data: "用户身份已过期,请重新登录"
                }
                return;
            }
            let usable = await ctx.service.token.isTokenUsable(token);
            if (!usable) {
                ctx.body = {
                    success: false,
                    data: "用户身份已过期,请重新登录"
                }
                return;
            }
        }
        await next();
    }
};