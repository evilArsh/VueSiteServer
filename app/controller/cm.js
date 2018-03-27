'use strict';
const Controller = require('egg').Controller;
class StudentController extends Controller{
    constructor(ctx) {
        super(ctx);
    }
    //参数?func=''?
    //万能函数=_=
    async create(){
        const{ctx,app}=this;
        let result;
        let data=ctx.request.body;
        let func=ctx.query.func;
        console.log(ctx.query);
        
        switch(func){
            //增
            case 'addFood': ctx.body = await ctx.service.cm.addFood(data); break;
            //改
            case 'modifyFood': ctx.body = await ctx.service.cm.modifyFood(data); break;
            //删
            case 'delFood': ctx.body = await ctx.service.cm.delFood(data);break;
            //查
            case 'findFood': ctx.body = await ctx.service.cm.findFood(data); break;
            default: ctx.body="{success:false,data:'请求出错'}";
        }
    }
    
}
module.exports = StudentController;