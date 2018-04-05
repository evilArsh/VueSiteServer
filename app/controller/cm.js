'use strict';
const Controller = require('egg').Controller;
class StudentController extends Controller {
    constructor(ctx) {
        super(ctx);
    }
    //参数?func=''?
    //万能函数=_=
    async create() {
        try {
            const {
                ctx,
                app
            } = this;
            let result;
            let data = ctx.request.body;
            let func = ctx.query.func;
            console.log(ctx.query);

            switch (func) {
                //增
                case 'addFood':
                    ctx.body = await ctx.service.cm.addFood(data);
                    break;
                    //改
                case 'modifyFood':
                    ctx.body = await ctx.service.cm.modifyFood(data);
                    break;
                    //删
                case 'delFood':
                    ctx.body = await ctx.service.cm.delFood(data);
                    break;
                    //查
                case 'findFood':
                    ctx.body = await ctx.service.cm.findFood(data);
                    break;
                case 'createOrder':
                    ctx.body = await ctx.service.cm.createOrder(data);
                    break;
                    //查看某个用户的订单
                case 'getOrder':
                    ctx.body = await ctx.service.cm.getOrder();
                    break;
                case 'delOrder':
                    ctx.body = await ctx.service.cm.delOrder(data);
                    break;
                case 'getAllOrder':
                    ctx.body = await ctx.service.cm.getAllOrder();
                    break;
                case 'getUser':
                    ctx.body = await ctx.service.cm.getUser();
                    break;
                default:
                    ctx.body = "{success:false,data:'请求出错'}";
            }
        } catch (err) {
            ctx.body = "{success:false,data:'请求出错'}";
        }
    }

}
module.exports = StudentController;