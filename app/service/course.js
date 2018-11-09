'use strict';
const Service = require('egg').Service;
class CourseService extends Service {
    constructor(ctx) {
        super(ctx);
    }
    async getCourseList(query) {
        const {
            app,
            ctx
        } = this;
        try {

            let { queryAfter, number } = ctx.helper.reqParamSet(query);
            queryAfter = parseInt(queryAfter);
            number = parseInt(number);
            var _where;
            switch (query.type) {
                case 'privateItems': _where = {
                    courseType: query.type,
                    courseCollege:query.college
                };break;
                case 'publicItems':_where={
                    courseType: query.type,
                }
            };
            const result = await app.mysql.select('a_course', {
                columns: ['id', 'courseType', 'courseTime', 'courseName', 'url', 'courseCollege'],
                orders: [
                    ['id', 'desc']
                ],
                limit: number,
                offset: queryAfter,
                where:_where
            });
            return ctx.app.msg(true, '课程数据', result);
        } catch (err) {

            throw err;
        }
    }
    async getCourseItem(id) {
        const {
            app,
            ctx
        } = this;
        try {
            id=parseInt(id);
            let resultChapter;
            let resultComment;
            let result = await app.mysql.select('a_course', {
                columns: ['courseType', 'courseTime', 'courseName', 'url', 'courseCollege','courseIntroduce'],
                where:{
                    id:id
                }
            });
            //获取章节
            if(result.length){
                 resultChapter = await app.mysql.select('a_course_chapter', {
                    columns: ['courseID','id','chapterName','url'],
                    where:{
                        courseID:id
                    }
                });
            }
            //评论
            if(result.length){
                resultComment = await app.mysql.select('a_course_comment', {
                    columns: ['courseID','id','content','userID'],
                    where:{
                        courseID:id
                    }
                });
            }
            let res=Object.assign({},result[0],{courseChapter:resultChapter,courseComment:resultComment});
            return ctx.app.msg(true, '课程数据', res);
        } catch (err) {

            throw err;
        }
    }
};
module.exports = CourseService;