const Controller = require('egg').Controller;

class NspController extends Controller {
  async req() {
    const { ctx, app } = this;
    const nsp = app.io.of('/');
    //message 为前端提交的载荷
    // {
    //   room: "demo",
    //   userId: `client_${Math.random()}`,
    //   payload: "请求信息"
    // }
    const message = ctx.args[0] || {};
    const socket = ctx.socket;
    const client = socket.id;
    console.log("###########触发")
    try {
      nsp.emit('res', { msg: `服务器发送一条消息过来了 socket id为：${client}` });
    } catch (error) {
      app.logger.error(error);
    }
  }
}

module.exports = NspController;