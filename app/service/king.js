'use strict';
const path = require('path');
const fs = require('fs');
const formidable = require("formidable");
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
const Service = require('egg').Service;
class KingService extends Service {
    constructor(ctx) {
        super(ctx);
    }
    async isAdmin() {
        const {
            ctx,
            app
        } = this;
        try {
            let admin = await app.mysql.select('user_verify', {
                column: ['userIsAdmin'],
                where: {
                    userAccessToken: ctx.service.token.getAccessToken()
                }
            })
            if (admin[0].userIsAdmin === "Y") {
                return true;
            }
            return false;
        } catch (err) {
            throw err;
        }
    }
    //教案列表
    async getLessonPlanList(data) {
        const { ctx, app } = this;
        try {
            let { queryAfter, number } = ctx.helper.reqParamSet(data);
            queryAfter = parseInt(queryAfter);
            number = parseInt(number);
            const result = await app.mysql.select('lessonplan', {
                columns: ['id', 'name', 'time'],
                orders: [
                    ['id', 'desc']
                ],
                limit: number,
                offset: queryAfter
            });
            let sql = `select count(id)as number from lessonplan`;
            let count = await app.mysql.query(sql);
            result.push(count[0].number)
            return ctx.helper.msg(true, '教案列表获取成功', result);
        } catch (err) {
            throw err;
        }
    }
    //基础资源列表
    async getBaseList(data) {
        const { ctx, app } = this;
        try {
            let { queryAfter, number } = ctx.helper.reqParamSet(data);
            queryAfter = parseInt(queryAfter);
            number = parseInt(number);
            const result = await app.mysql.select('base', {
                columns: ['id', 'name', 'time'],
                orders: [
                    ['id', 'desc']
                ],
                limit: number,
                offset: queryAfter
            });
            let sql = `select count(id)as number from base`;
            let count = await app.mysql.query(sql);
            result.push(count[0].number)
            return ctx.helper.msg(true, '基础资源列表获取成功', result);
        } catch (err) {
            throw err;
        }
    }
    //课件列表
    async getCoursewareList(data) {
        const { ctx, app } = this;
        try {
            let { queryAfter, number } = ctx.helper.reqParamSet(data);
            queryAfter = parseInt(queryAfter);
            number = parseInt(number);

            const result = await app.mysql.select('courseware', {
                columns: ['id', 'fileURL', 'name', 'time'],
                orders: [
                    ['id', 'desc']
                ],
                limit: number,
                offset: queryAfter
            });
            let sql = `select count(id)as number from courseware`;
            let count = await app.mysql.query(sql);
            result.push(count[0].number)
            return ctx.helper.msg(true, '教案列表获取成功', result);
        } catch (err) {
            throw err;
        }
    }
    //拓展资源列表
    async getExtendList(data) {
        const { ctx, app } = this;
        try {
            let { queryAfter, number } = ctx.helper.reqParamSet(data);
            queryAfter = parseInt(queryAfter);
            number = parseInt(number);

            const result = await app.mysql.select('extend', {
                columns: ['id', 'fileURL', 'name', 'time'],
                orders: [
                    ['id', 'desc']
                ],
                limit: number,
                offset: queryAfter
            });
            let sql = `select count(id)as number from extend`;
            let count = await app.mysql.query(sql);
            result.push(count[0].number)
            return ctx.helper.msg(true, '拓展资源列表获取成功', result);
        } catch (err) {
            throw err;
        }
    }
    async getVideoList(data) {
        const { ctx, app } = this;
        try {
            let { queryAfter, number } = ctx.helper.reqParamSet(data);
            queryAfter = parseInt(queryAfter);
            number = parseInt(number);

            const result = await app.mysql.select('video', {
                columns: ['id', 'fileURL', 'name', 'time'],
                orders: [
                    ['id', 'desc']
                ],
                limit: number,
                offset: queryAfter
            });
            let sql = `select count(id)as number from video`;
            let count = await app.mysql.query(sql);
            result.push(count[0].number)
            return ctx.helper.msg(true, '视频列表获取成功', result);
        } catch (err) {
            throw err;
        }
    }
    async getVideoURL(id) {
        const { ctx, app } = this;
        try {
            id=parseInt(id);
            const result = await app.mysql.select('video', {
                columns: ['fileURL', 'name', 'time'],
                where:{
                    id:id
                }
            });
            if(result.length===1){
            return ctx.helper.msg(true, '获取成功', result[0]);
            }
            return ctx.helper.msg(false, '获取失败');
        } catch (err) {
            throw err;
        }
    }
    async getSpeechURL(id) {
        const { ctx, app } = this;
        try {
            id=parseInt(id);
            const result = await app.mysql.select('speech', {
                columns: ['fileURL', 'name', 'time'],
                where:{
                    id:id
                }
            });
            if(result.length===1){
            return ctx.helper.msg(true, '获取成功', result[0]);
            }
            return ctx.helper.msg(false, '获取失败');
        } catch (err) {
            throw err;
        }
    }
    async getSpeechList(data) {
        const { ctx, app } = this;
        try {
            let { queryAfter, number } = ctx.helper.reqParamSet(data);
            queryAfter = parseInt(queryAfter);
            number = parseInt(number);

            const result = await app.mysql.select('speech', {
                columns: ['id', 'fileURL', 'name', 'time'],
                orders: [
                    ['id', 'desc']
                ],
                limit: number,
                offset: queryAfter
            });
            let sql = `select count(id)as number from speech`;
            let count = await app.mysql.query(sql);
            result.push(count[0].number)
            return ctx.helper.msg(true, '视频列表获取成功', result);
        } catch (err) {
            throw err;
        }
    }
    //拓展列表
    async getDiscussList(data) {
        const { ctx, app } = this;
        try {
            let { queryAfter, number } = ctx.helper.reqParamSet(data);
            queryAfter = parseInt(queryAfter);
            number = parseInt(number);

            const result = await app.mysql.select('discuss', {
                columns: ['id', 'fileURL', 'name', 'time'],
                orders: [
                    ['id', 'desc']
                ],
                limit: number,
                offset: queryAfter
            });
            let sql = `select count(id)as number from discuss`;
            let count = await app.mysql.query(sql);
            result.push(count[0].number)
            return ctx.helper.msg(true, '互动列表获取成功', result);
        } catch (err) {
            throw err;
        }
    }
    //教案列表
    async getLessonPlanContent(id) {
        const { ctx, app } = this;
        try {
            id = parseInt(id);
            const result = await app.mysql.select('lessonplan', {
                columns: ['content', 'time', 'fileURL', 'name'],
                where: {
                    'id': id
                }
            });
            if (result.length) {
                return ctx.helper.msg(true, '获取数据成功', result[0]);
            }
            return ctx.helper.msg(false, '获取数据失败');
        } catch (err) {
            throw err;
        }
    }
    //基础资源列表
    async getBaseContent(id) {
        const { ctx, app } = this;
        try {
            id = parseInt(id);
            const result = await app.mysql.select('base', {
                columns: ['content', 'time', 'fileURL', 'name'],
                where: {
                    'id': id
                }
            });
            if (result.length) {
                return ctx.helper.msg(true, '获取数据成功', result[0]);
            }
            return ctx.helper.msg(false, '获取数据失败');
        } catch (err) {
            throw err;
        }
    }
    //拓展单个内容
    async getExtendContent(id) {
        const { ctx, app } = this;
        try {
            id = parseInt(id);
            const result = await app.mysql.select('extend', {
                columns: ['content', 'time', 'fileURL', 'name'],
                where: {
                    'id': id
                }
            });
            if (result.length) {
                return ctx.helper.msg(true, '获取数据成功', result[0]);
            }
            return ctx.helper.msg(false, '获取数据失败');
        } catch (err) {
            throw err;
        }
    }
    //单个互动内容
    async getDiscussContent(id) {
        const { ctx, app } = this;
        try {
            id = parseInt(id);
            const result = await app.mysql.select('discuss', {
                columns: ['content', 'time', 'fileURL', 'name'],
                where: {
                    'id': id
                }
            });
            if (result.length) {
                return ctx.helper.msg(true, '获取数据成功', result[0]);
            }
            return ctx.helper.msg(false, '获取数据失败');
        } catch (err) {
            throw err;
        }
    }
    //公共内容
    async getCommonContent(target) {
        const { ctx, app } = this;
        try {
            const result = await app.mysql.select('common', {
                columns: ['content', 'time', 'fileURL', 'name'],
                where: {
                    'target': target
                }
            });
            if (result.length) {
                return ctx.helper.msg(true, '获取数据成功', result[0]);
            }
            return ctx.helper.msg(false, '获取数据失败');
        } catch (err) {
            throw err;
        }
    }
    async delBase(id) {
        const {
            ctx,
            app
        } = this;
        try {
            id = parseInt(id);
            let usable = await ctx.service.token.isTokenUsable();
            if (usable) {
                let result = await app.mysql.delete('base', {
                    id: id
                })
                if (result.affectedRows === 1) {
                    return ctx.helper.msg(true, '删除成功');
                }
            } else {
                return ctx.helper.msg(false, '非管理员禁止访问');
            }
            return ctx.helper.msg(false, '删除失败');
        } catch (err) {
            throw err;
        }
    }
    async delCommon(id) {
        const {
            ctx,
            app
        } = this;
        try {
            id = parseInt(id);
            let usable = await ctx.service.token.isTokenUsable();
            if (usable) {
                let result = await app.mysql.delete('common', {
                    id: id
                })
                if (result.affectedRows === 1) {
                    return ctx.helper.msg(true, '删除成功');
                }
            } else {
                return ctx.helper.msg(false, '非管理员禁止访问');
            }
            return ctx.helper.msg(false, '删除失败');
        } catch (err) {
            throw err;
        }
    }
    async delCourseware(id) {
        const {
            ctx,
            app
        } = this;
        try {
            id = parseInt(id);
            let usable = await ctx.service.token.isTokenUsable();
            if (usable) {
                let result = await app.mysql.delete('courseware', {
                    id: id
                })
                if (result.affectedRows === 1) {
                    return ctx.helper.msg(true, '删除成功');
                }
            } else {
                return ctx.helper.msg(false, '非管理员禁止访问');
            }
            return ctx.helper.msg(false, '删除失败');
        } catch (err) {
            throw err;
        }
    }
    async delDiscuss(id) {
        const {
            ctx,
            app
        } = this;
        try {
            id = parseInt(id);
            let usable = await ctx.service.token.isTokenUsable();
            if (usable) {
                let result = await app.mysql.delete('discuss', {
                    id: id
                })
                if (result.affectedRows === 1) {
                    return ctx.helper.msg(true, '删除成功');
                }
            } else {
                return ctx.helper.msg(false, '非管理员禁止访问');
            }
            return ctx.helper.msg(false, '删除失败');
        } catch (err) {
            throw err;
        }
    }
    async delExtend(id) {
        const {
            ctx,
            app
        } = this;
        try {
            id = parseInt(id);
            let usable = await ctx.service.token.isTokenUsable();
            if (usable) {
                let result = await app.mysql.delete('extend', {
                    id: id
                })
                if (result.affectedRows === 1) {
                    return ctx.helper.msg(true, '删除成功');
                }
            } else {
                return ctx.helper.msg(false, '非管理员禁止访问');
            }
            return ctx.helper.msg(false, '删除失败');
        } catch (err) {
            throw err;
        }
    }
    async delLessonPlan(id) {
        const {
            ctx,
            app
        } = this;
        try {
            id = parseInt(id);
            let usable = await ctx.service.token.isTokenUsable();
            if (usable) {
                let result = await app.mysql.delete('lessonplan', {
                    id: id
                })
                if (result.affectedRows === 1) {
                    return ctx.helper.msg(true, '删除成功');
                }
            } else {
                return ctx.helper.msg(false, '非管理员禁止访问');
            }
            return ctx.helper.msg(false, '删除失败');
        } catch (err) {
            throw err;
        }
    }
    async delVideo(id) {
        const {
            ctx,
            app
        } = this;
        try {
            id = parseInt(id);
            let usable = await ctx.service.token.isTokenUsable();
            if (usable) {
                let result = await app.mysql.delete('video', {
                    id: id
                })
                if (result.affectedRows === 1) {
                    return ctx.helper.msg(true, '删除成功');
                }
            } else {
                return ctx.helper.msg(false, '非管理员禁止访问');
            }
            return ctx.helper.msg(false, '删除失败');
        } catch (err) {
            throw err;
        }
    }
    async delSpeech(id) {
        const {
            ctx,
            app
        } = this;
        try {
            id = parseInt(id);
            let usable = await ctx.service.token.isTokenUsable();
            if (usable) {
                let result = await app.mysql.delete('speech', {
                    id: id
                })
                if (result.affectedRows === 1) {
                    return ctx.helper.msg(true, '删除成功');
                }
            } else {
                return ctx.helper.msg(false, '非管理员禁止访问');
            }
            return ctx.helper.msg(false, '删除失败');
        } catch (err) {
            throw err;
        }
    }
    async _upLoadFile() {
        const {
            ctx,
            app
        } = this;
        let URI = '';
        //文件的个数
        let flag = 0;
        const parts = this.ctx.multipart({ autoFields: true });
        let part;
        try {
            while ((part = await parts()) !== null) {
                if (typeof part === 'object' && 'undefined' !== typeof part.filename) {
                    const fn = app.md5(part.filename.toLowerCase(), new Date(), false) + part.filename.substr(part.filename.lastIndexOf('.'));
                    // if (!fs.existsSync(path.join(this.config.baseDir, app.config.sourceDir, p))) {
                    //     fs.mkdirSync(path.join(this.config.baseDir, app.config.sourceDir, p));
                    // }
                    const target = path.join(this.config.baseDir, app.config.sourceDir, fn);
                    URI = path.join('/', fn);
                    const writeStream = fs.createWriteStream(target);
                    await awaitWriteStream(part.pipe(writeStream));
                    flag++;
                }
                if (typeof part !== 'object') break;
            }
            if (!flag) {
                throw new Error('no any file,please choose at least one file');
            }
            return URI;
        } catch (err) {
            if (typeof part === 'object') {
                await sendToWormhole(part);
            }
            throw err;
        }
    }
    async upLoadFile(data) {
        const {
            ctx,
            app
        } = this;
        try {
            let usable = await ctx.service.token.isTokenUsable();
            if (!usable) {
                return ctx.helper.errorUserIdentify(app.config.ERROR_USER_IDENTIFY);
            }
            let ad = await this.isAdmin();
            if (!ad) {
                return ctx.helper.msg(false, '非管理员禁止上传');
            }
            let target = data.target,
                title = data.title;
            if (!(typeof app.config.upload[target] !== 'undefined')) {
                return ctx.helper.msg(false, '请输入正确的请求参数');
            }

            //上传文件
            let uri = await this._upLoadFile();
            //插入数据库
            let rst = await app.mysql.insert(target, {
                'name': title,
                'fileURL': uri,
                'time': ctx.helper.dateFormate('yyyy-MM-dd', new Date())
            });
            if (rst.affectedRows === 1) {
                return ctx.helper.msg(true, '文件上传成功')
            }
            return ctx.helper.msg(false, '文件上传失败')
        } catch (err) {
            console.log("uploadERR:", err);
            throw err;
        }
    }
    async upLoadContent(target, data) {
        const {
            ctx,
            app
        } = this;
        try {
            let usable = await ctx.service.token.isTokenUsable();
            if (!usable) {
                return ctx.helper.errorUserIdentify(app.config.ERROR_USER_IDENTIFY);
            }
            let ad = await this.isAdmin();
            if (!ad) {
                return ctx.helper.msg(false, '非管理员禁止上传');
            }
            //插入数据库
            let rst = await app.mysql.insert(target, {
                'name': data.title,
                'content': data.content,
                'time': ctx.helper.dateFormate('yyyy-MM-dd', new Date())
            });
            if (rst.affectedRows === 1) {
                return ctx.helper.msg(true, '发布成功')
            }
            return ctx.helper.msg(false, '发布失败')
        } catch (err) {
            throw err;
        }
    }
    async upLoadCommonContent(target, data) {
        const {
            ctx,
            app
        } = this;
        try {
            let usable = await ctx.service.token.isTokenUsable();
            if (!usable) {
                return ctx.helper.errorUserIdentify(app.config.ERROR_USER_IDENTIFY);
            }
            let ad = await this.isAdmin();
            if (!ad) {
                return ctx.helper.msg(false, '非管理员禁止上传');
            }
            //插入数据库
            let rst = await app.mysql.insert(target, {
                'target': data.target,
                'name': data.name,
                'content': data.content,
                'time': ctx.helper.dateFormate('yyyy-MM-dd', new Date())
            });
            if (rst.affectedRows === 1) {
                return ctx.helper.msg(true, '发布成功')
            }
            return ctx.helper.msg(false, '发布失败')
        } catch (err) {
            throw err;
        }
    }
    async upDateContent(target, data) {
        const {
            ctx,
            app
        } = this;
        try {
            let usable = await ctx.service.token.isTokenUsable();
            if (!usable) {
                return ctx.helper.errorUserIdentify(app.config.ERROR_USER_IDENTIFY);
            }
            let ad = await this.isAdmin();
            if (!ad) {
                return ctx.helper.msg(false, '非管理员禁止上传');
            }
            //插入数据库
            let rst = await app.mysql.update(target, {
                'name': data.name,
                'content': data.content,
                'time': ctx.helper.dateFormate('yyyy-MM-dd', new Date())
            },{where:{
                target:data.target
            }});
            if (rst.affectedRows === 1) {
                return ctx.helper.msg(true, '更新成功')
            }
            return ctx.helper.msg(false, '更新失败')
        } catch (err) {
            throw err;
        }
    }

};
module.exports = KingService;