'use strict';
const Controller = require('egg').Controller;
class CourseController extends Controller{
    constructor(ctx){
        super(ctx);

    }
    // /api/course?type=?&queryAfter=?&number=?
    async index(){
        const{ctx,app}=this;
        try{
           ctx.body=await ctx.service.course.getCourseList(ctx.query);
        }catch(err){
            console.log(err)
            ctx.body=ctx.app.msg(false,'获取失败')
        }
    }
    async show(){
        const{ctx,app}=this;
        try{
           ctx.body=await ctx.service.course.getCourseItem(ctx.params.id);
        }catch(err){
            console.log(err)
            ctx.body=ctx.app.msg(false,'获取失败')
        }
    }
};
module.exports = CourseController;