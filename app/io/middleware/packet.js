module.exports = app => {
    return async (ctx, next) => {
        // ctx.socket.emit('res', {
        //     data: "has been connected"
        // });
        await next();
    };
};