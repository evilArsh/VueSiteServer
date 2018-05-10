'use strict';
const Service = require('egg').Service;
const path = require('path');
const fs = require('fs');
const formidable = require("formidable");
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
class AaService extends Service {
    //是否成功 提示信息 返回数据
    async setStatus(su, da, pa) {
        var d = {
            success: su,
            data: da,
        };
        if (pa) {
            d.package = pa;
        }
        return d;
    }
    //设置用户身份
    async setIdentify(data) {
        const {
            ctx,
            app
        } = this;
        try {
            var d = data.isAdmin === true ? "Y" : "N";

            await app.mysql.update('user_verify', {
                userIsAdmin: d
            }, {
                    where: {
                        userMail: data.userMail
                    }
                })
        } catch (err) {
            console.log(err);

        }
    }
    //获取所有可下载文件
    async getFiles(data) {
        const { ctx, app } = this;
        try {
            let { queryAfter, number } = ctx.helper.reqParamSet(data);
            queryAfter = parseInt(queryAfter);
            number = parseInt(number);
            const result = await app.mysql.select('matchs', {
                columns: ['id', 'fileURI', 'time'],
                orders: [
                    ['id', 'desc']
                ],
                limit: number,
                offset: queryAfter
            });
            let sql = `select count(id)as number from matchs`;
            let count = await app.mysql.query(sql);
            result.push(count[0].number)

            // console.log(Object.assign({},count,result));

            return this.setStatus(true, '获取数据成功', result);
        } catch (err) {
            throw err;
        }
    }
    //用户获取竞赛信息
    async getMsg(data) {
        const { ctx, app } = this;
        try {
            let type = data.type;

            let { queryAfter, number } = ctx.helper.reqParamSet(data);
            queryAfter = parseInt(queryAfter);
            number = parseInt(number);
            const result = await app.mysql.select('matchs', {
                columns: ['id', 'type', 'title', 'content', 'imageURI', 'fileURI', 'time'],
                orders: [
                    ['id', 'desc']
                ],
                where: {
                    'type': type
                },
                limit: number,
                offset: queryAfter
            });
            let sql = `select count(id)as number from matchs WHERE type='` + type + `'`;
            let count = await app.mysql.query(sql);
            result.push(count[0].number)

            // console.log(Object.assign({},count,result));

            return this.setStatus(true, '获取数据成功', result);
        } catch (err) {
            throw err;
        }
    }
    //用户获取竞赛内容
    async getContent(id) {
        const { ctx, app } = this;
        try {
            const result = await app.mysql.select('matchs', {
                columns: ['content', 'time'],
                where: {
                    'id': id
                }
            });
            if (result.length) {
                return this.setStatus(true, '获取数据成功', result[0]);
            }
            return this.setStatus(false, '获取数据失败');
        } catch (err) {
            throw err;
        }
    }
    //私有函数 文件上传
    async _upLoadFile() {
        const {
            ctx,
            app
        } = this;
        let URI = {
            fileURI: '',
            imageURI: ''
        }
        const parts = this.ctx.multipart({ autoFields: true });
        let part;
        try {
            while ((part = await parts()) !== null) {
                if (typeof part === 'object' && 'undefined' !== typeof part.filename) {
                    const fn = part.filename.toLowerCase();
                    switch (part.fieldname) {
                        case 'file': URI.fileURI = part.filename; break;
                        case 'image': URI.imageURI = part.filename; break;
                    };
                    const target = path.join(this.config.baseDir, app.config.sourceDir, fn);
                    const writeStream = fs.createWriteStream(target);
                    await awaitWriteStream(part.pipe(writeStream));
                }
                if (typeof part !== 'object') break;
            }
            return URI;
        } catch (err) {
            if (typeof part === 'object') {
                await sendToWormhole(part);
            }
            throw err;
        }
    }
    //用户是否是管理员
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
    //管理员上传信息
    async upLoadMsg(param) {
        const {
            ctx,
            app
        } = this;
        let usable = await ctx.service.token.isTokenUsable();
        if (!usable) {
            return ctx.helper.errorUserIdentify(app.config.ERROR_USER_IDENTIFY);
        }
        let ad = await this.isAdmin();
        if (!ad) {
            return this.setStatus(false, '非管理员禁止上传');
        }

        let type = param.type,
            title = param.title,
            content = '';
        try {
            //获取放在表单中上传的文本内容
            let form = new formidable.IncomingForm();
            form.parse(ctx.req, async function (err, fields, files) {
                if (err) {
                    throw err;
                }
                content = fields.content;
            });
            //上传文件
            let uri = await this._upLoadFile();
            //插入数据库
            let rst = await app.mysql.insert('matchs', {
                'type': type,
                'title': title,
                'content': content,
                'imageURI': uri.imageURI,
                'fileURI': uri.fileURI,
                'time': ctx.helper.dateFormate('yyyy-MM-dd', new Date())
            })
            if (rst.affectedRows === 1) {
                return this.setStatus(true, '文件上传成功')
            }
            return this.setStatus(false, '文件上传失败')
        } catch (err) {
            console.log("uploadERR:", err);
            throw err;
        }
    }
    //用户报名
    async userUpload(param) {
        const {
            ctx,
            app
        } = this;
        let name = param.name || '',
            number = param.number || '',
            projectName = param.projectName || '',
            teacher = param.teacher || '';
        const conn = await app.mysql.beginTransaction();

        try {
            let usable = await ctx.service.token.isTokenUsable();
            if (!usable) {
                return ctx.helper.errorUserIdentify(app.config.ERROR_USER_IDENTIFY);
            }
            //事务开启

            //上传文件
            let uri = await this._upLoadFile();
            //必须输入完整的信息

            if (!name.length || !number.length || !projectName.length || !teacher.length || !uri.fileURI.length) {
                return this.setStatus(false, '请输入完整的报名信息')
            }
            let id = await app.mysql.select('user_verify', {
                columns: ['userID', 'joinTime', 'userNickName'],
                where: {
                    userAccessToken: ctx.service.token.getAccessToken()
                }
            });
            //插入数据库
            let rst = await app.mysql.insert('user_project', {
                'userID': id[0].userID,
                'userNickName': id[0].userNickName,
                'userNumber': number,
                'projectName': projectName,
                'userFileURI': uri.fileURI,
                'userTeacher': teacher,
                'userPass': 'N',
                'time': ctx.helper.dateFormate('yyyy-MM-dd', new Date())
            })
            let ts;
            if (!isNaN(id[0].joinTime)) {
                ts = id[0].joinTime + 1;
            } else {
                ts = 1;
            }
            let t = await app.mysql.update('user_verify', {
                'joinTime': ts
            }, {
                    where: {
                        userID: id[0].userID
                    }
                });
            await conn.commit();
            if (rst.affectedRows === 1 && t.affectedRows === 1) {
                return this.setStatus(true, '报名成功', uri)
            }
            return this.setStatus(false, '报名失败', uri)
        } catch (err) {
            await conn.rollback();
            console.log("uploadERR:", err);
            throw err;
        }
    }
    //未完成
    async updateUser() {
        const {
            ctx,
            app
        } = this;
        try {

            let usable = await ctx.service.token.isTokenUsable();
            if (!usable) {
                return ctx.helper.errorUserIdentify(app.config.ERROR_USER_IDENTIFY);
            }
        } catch (err) {

        }
    }
    //参赛作品管理 参赛学生管理
    async fileManage(data) {
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
                return this.setStatus(false, '非管理员禁止访问');
            }
            let { queryAfter, number } = ctx.helper.reqParamSet(data);
            queryAfter = parseInt(queryAfter);
            number = parseInt(number);
            let sql = `SELECT a.id,a.userNickName,a.userFileURI,a.userPass,a.userNumber,a.userTeacher,a.projectName,
            b.userPhone from user_verify as b,user_project as a where 
            a.userID=b.userID ORDER BY a.userID DESC 
            LIMIT ${queryAfter},${number}`;
            const result = await app.mysql.query(sql);
            let sql2 = `select count(id)as number from user_project`;
            const amount = await app.mysql.query(sql2);
            result.push(amount[0].number);
            return this.setStatus(true, '数据获取成功', result)
        } catch (err) {
            throw err
        }
    }
    //审核
    //项目id 通过or未通过
    async check(data) {
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
                return this.setStatus(false, '非管理员禁止访问');
            }
            var ps = data.pass === "已通过" ? "Y" : "N";
            let rs = await app.mysql.update('user_project', {
                userPass: ps
            }, {
                    where: {
                        id: parseInt(data.id)
                    }
                })
            if (rs.affectedRows === 1) {
                return this.setStatus(true, '设置成功')
            }
            return this.setStatus(false, '设置失败')
        } catch (err) {
            throw err;
        }
    }
    //删除项目
    //项目id
    async delProject(data) {
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
                return this.setStatus(false, '非管理员禁止访问');
            }
            let rs = await app.mysql.delete('user_project', {
                id: parseInt(data.id)
            });
            if (rs.affectedRows === 1) {
                return this.setStatus(true, '删除成功')
            }
            return this.setStatus(false, '删除失败，你不能删除别人的留言')
        } catch (err) {
            throw err;
        }
    }
    //修改项目
    //项目id 姓名 学号 导师
    async change(data) {
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
                return this.setStatus(false, '非管理员禁止访问');
            }

            if (
                typeof data.userNickName !== 'string' ||
                typeof data.userNumber !== 'string' ||
                typeof data.userTeacher !== 'string' ||
                isNaN(parseInt(data.id))) {
                return this.setStatus(false, '修改失败,数据输入有误')
            };
            let rs = await app.mysql.update('user_project', {
                userNickName: data.userNickName,
                userNumber: data.userNumber,
                userTeacher: data.userTeacher
            }, {
                    where: {
                        id: parseInt(data.id)
                    }
                });
            if (rs.affectedRows === 1) {
                return this.setStatus(true, '修改成功')
            }
            return this.setStatus(false, '修改失败')
        } catch (err) {
            throw err;
        }
    }
    //数据统计
    async getUserData(data) {
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
                return this.setStatus(false, '非管理员禁止访问');
            }
            let { queryAfter, number } = ctx.helper.reqParamSet(data);
            queryAfter = parseInt(queryAfter);
            number = parseInt(number);
            const results = await app.mysql.select('user_verify', {
                columns: ['userID', 'userNickName', 'joinTime', 'userNumber'],
                limit: number,
                offset: queryAfter
            });
            let sql2 = `select count(userID)as number from user_verify`;
            const amount = await app.mysql.query(sql2);
            results.push(amount[0].number);
            return this.setStatus(true, '数据获取成功', results)
        } catch (err) {
            throw err
        }
    }
    //删除用户参赛数据
    //用户id
    async delProjectU(data) {
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
                return this.setStatus(false, '非管理员禁止访问');
            }
            let rs = await app.mysql.delete('user_project', {
                userID: parseInt(data.userID)
            });
            if (rs.affectedRows === 1) {
                return this.setStatus(true, '删除成功')
            }
            if (rs.affectedRows === 0) {
                return this.setStatus(false, '用户没有参赛作品')
            }
            return this.setStatus(false, '删除成功')
        } catch (err) {
            throw err;
        }
    }
    //获取留言
    //参数 queryAfter, number
    async getBoard(data) {
        const {
            ctx,
            app
        } = this;
        try {
            let { queryAfter, number } = ctx.helper.reqParamSet(data);
            const result = await app.mysql.select('user_content', {
                columns: ['userID', 'contentID', 'userNickName', 'content', 'starTime', 'time'],
                orders: [
                    ['contentID', 'desc']
                ],
                limit: number,
                offset: queryAfter
            });
            let sql2 = `select count(contentID)as number from user_content`;
            let count = await app.mysql.query(sql2);
            result.push(count[0].number)

            return { success: true, data: '留言获取成功', package: result };
        } catch (err) {
            throw err;
        }
    }
    //获取子留言
    //attachContentID 那个留言下的子留言
    //
    async getBoardReply(data) {
        const {
            ctx,
            app
        } = this;
        try {

            let { queryAfter, number } = ctx.helper.reqParamSet(data);
            const result = await app.mysql.select('user_contentReply', {
                columns: ['userID', 'replyID', 'attachContentID', 'contentID', 'content', 'starTime', 'time', 'userNickName', 'userNickNameReply'],
                orders: [
                    ['contentID', 'desc']
                ],
                where: {
                    attachContentID: parseInt(data.attachContentID)
                },
                limit: number,
                offset: queryAfter
            });
            let sql2 = `select count(contentID)as number from user_contentReply where attachContentID=${parseInt(data.attachContentID)} `;
            let count = await app.mysql.query(sql2);

            result.push(count[0].number)
            return { success: true, data: '留言获取成功', package: result };
        } catch (err) {
            throw err;
        }
    }
    //删除留言
    //留言ID contentID 不能删除别人的留言
    async delBoard(data) {
        const {
            ctx,
            app
        } = this;
        try {
            let usable = await ctx.service.token.isTokenUsable();
            if (!usable) {
                return ctx.helper.errorUserIdentify(app.config.ERROR_USER_IDENTIFY);
            }
            let userID = await ctx.service.user.getUserIDByToken();
            const result = await app.mysql.delete('user_content', {
                contentID: data.contentID,
                userID: userID.package.userID
            });
            if (result.affectedRows === 1)
                return { success: true, data: '留言删除成功' };
            return { success: false, data: '留言删除失败,您不能删除别人的留言' };
        } catch (err) {
            console.log(err);

            throw err;
        }
    }
    //删除子留言
    //留言id
    async delBoardReply(data) {
        const {
            ctx,
            app
        } = this;
        try {
            let usable = await ctx.service.token.isTokenUsable();
            if (!usable) {
                return ctx.helper.errorUserIdentify(app.config.ERROR_USER_IDENTIFY);
            }
            let userID = await ctx.service.user.getUserIDByToken();
            const result = await app.mysql.delete('user_contentReply', {
                contentID: data.contentID,
                userID: userID.package.userID
            });
            if (result.affectedRows === 1)
                return { success: true, data: '留言删除成功' };
            return { success: false, data: '留言删除失败,您不能删除别人的留言' };

        } catch (err) {
            throw err
        }

    }
    //赞留言
    //留言id
    async starBoard(data) {
        const {
            ctx,
            app
        } = this;
        try {
            let usable = await ctx.service.token.isTokenUsable();
            if (!usable) {
                return ctx.helper.errorUserIdentify(app.config.ERROR_USER_IDENTIFY);
            }
            console.log(data.contentID);

            let sql = `update user_content set starTime=starTime+1 where contentID =${data.contentID}`;
            let rst = app.mysql.query(sql);
            return { success: true, data: '点赞成功' };


        } catch (err) {

            return { success: false, data: '点赞失败' };
        }
    }
    //赞子留言
    async starBoardReply(data) {
        const {
            ctx,
            app
        } = this;
        try {
            let usable = await ctx.service.token.isTokenUsable();
            if (!usable) {
                return ctx.helper.errorUserIdentify(app.config.ERROR_USER_IDENTIFY);
            }
            let sql = 'update user_contentReply set starTime=starTime+1 where contentID =?';
            // sql = app.mysql.escape(sql);
            let rst = app.mysql.query(sql, [data.contentID]);
            return { success: true, data: '点赞成功' };


        } catch (err) {
            return { success: false, data: '点赞失败' };
        }
    }
    //添加新的留言
    //content
    async addBoard(data) {
        const {
            ctx,
            app
        } = this;
        try {
            let usable = await ctx.service.token.isTokenUsable();
            if (!usable) {
                return ctx.helper.errorUserIdentify(app.config.ERROR_USER_IDENTIFY);
            }
            let userIDR = await ctx.service.user.getUserIDByToken();
            let userInfo = await ctx.service.user.getUserInfoByToken();
            let rst = await app.mysql.insert('user_content', {
                userID: userIDR.package.userID,
                userNickName: userInfo.package.userNickName,
                content: data.content,
                starTime: 0,
                time: ctx.helper.dateFormate('yyyy-MM-dd hh:mm:ss', new Date())
            });
            if (rst.affectedRows === 1) {
                return { success: true, data: '留言成功' };

            }
            return { success: false, data: '留言失败' };

        } catch (err) {
            console.log(err);

            return { success: false, data: '留言失败' };
        }
    }
    //添加新的子留言
    // attachContentID(在哪个root留言下) replayID(给谁回复) content userNickName userNickNameReply
    async addBoardReply(data) {
        const {
            ctx,
            app
        } = this;
        try {
            let usable = await ctx.service.token.isTokenUsable();
            if (!usable) {
                return ctx.helper.errorUserIdentify(app.config.ERROR_USER_IDENTIFY);
            }
            let attachContentID = parseInt(data.attachContentID);
            let replyID = parseInt(data.replyID);
            let userID = await ctx.service.user.getUserIDByToken();
            let rst = await app.mysql.insert('user_contentReply', {
                userID: userID.package.userID,
                userNickName: data.userNickName,

                attachContentID: attachContentID,
                content: data.content,

                replyID: replyID,
                userNickNameReply: data.userNickNameReply,

                starTime: 0,
                time: ctx.helper.dateFormate('yyyy-MM-dd hh:mm:ss', new Date())
            });
            let id = await app.mysql.select('user_contentReply', {
                columns: ['contentID'],
                where: {
                    userID: userID.package.userID,
                    attachContentID: attachContentID,
                    replyID: replyID,
                    userNickNameReply: data.userNickNameReply,
                    userNickName: data.userNickName,
                }
            });
            if (rst.affectedRows === 1 && id.length) {
                return { success: true, data: '留言成功', package: id[0].contentID };

            }
            return { success: false, data: '留言失败' };

        } catch (err) {
            console.log(err);

            return { success: false, data: '留言失败' };
        }
    }
    //用户添加留言
    async sendUserBoard(data) {
        const {
            ctx,
            app
        } = this;
        try {
            let usable = await ctx.service.token.isTokenUsable();
            if (!usable) {
                return ctx.helper.errorUserIdentify(app.config.ERROR_USER_IDENTIFY);
            }
            console.log(data.contentID);

            let sql = `update user_content set starTime=starTime+1 where contentID =${data.contentID}`;
            let rst = app.mysql.query(sql);
            return { success: true, data: '点赞成功' };


        } catch (err) {

            return { success: false, data: '点赞失败' };
        }
    }
    //赞子留言
    async starBoardReply(data) {
        const {
            ctx,
            app
        } = this;
        try {
            let usable = await ctx.service.token.isTokenUsable();
            if (!usable) {
                return ctx.helper.errorUserIdentify(app.config.ERROR_USER_IDENTIFY);
            }
            let sql = 'update user_contentReply set starTime=starTime+1 where contentID =?';
            // sql = app.mysql.escape(sql);
            let rst = app.mysql.query(sql, [data.contentID]);
            return { success: true, data: '点赞成功' };


        } catch (err) {
            return { success: false, data: '点赞失败' };
        }
    }
    //添加新的用户联系留言
    //content
    async sendUserBoard(data) {
        const {
            ctx,
            app
        } = this;
        try {
            let usable = await ctx.service.token.isTokenUsable();
            if (!usable) {
                return ctx.helper.errorUserIdentify(app.config.ERROR_USER_IDENTIFY);
            }
            let userIDR = await ctx.service.user.getUserIDByToken();
            let rst = await app.mysql.insert('user_message', {
                userID: userIDR.package.userID,
                userContent: data.userMsg,
                replyContent: '暂未回复',
                time: ctx.helper.dateFormate('yyyy-MM-dd hh:mm:ss', new Date())
            });
            if (rst.affectedRows === 1) {
                return { success: true, data: '留言成功' };

            }
            return { success: false, data: '留言失败' };

        } catch (err) {
            console.log(err);

            return { success: false, data: '留言失败' };
        }
    }
    //删除用户联系留言
    //留言id
    async delUserBoard(data) {
        const {
            ctx,
            app
        } = this;
        try {
            let usable = await ctx.service.token.isTokenUsable();
            if (!usable) {
                return ctx.helper.errorUserIdentify(app.config.ERROR_USER_IDENTIFY);
            }
            let userIDR = await ctx.service.user.getUserIDByToken();
            let rst = await app.mysql.delete('user_message', {
                userID: userIDR.package.userID,
                id: parseInt(data.id),
            });
            if (rst.affectedRows === 1) {
                return { success: true, data: '删除成功' };

            }
            return { success: false, data: '删除失败' };

        } catch (err) {
            console.log(err);

            return { success: false, data: '删除失败' };
        }
    }
    //获取用户自己的留言
    async getUserBoard(data) {
        const {
            ctx,
            app
        } = this;
        try {
            let usable = await ctx.service.token.isTokenUsable();
            if (!usable) {
                return ctx.helper.errorUserIdentify(app.config.ERROR_USER_IDENTIFY);
            }
            let userIDR = await ctx.service.user.getUserIDByToken();
            let { queryAfter, number } = ctx.helper.reqParamSet(data);
            const result = await app.mysql.select('user_message', {
                columns: ['id', 'userContent', 'replyContent', 'time'],
                where: {
                    userID: userIDR.package.userID
                },
                orders: [
                    ['id', 'desc']
                ],
                limit: number,
                offset: queryAfter
            });
            let sql2 = `select count(id)as number from user_message where userID=${userIDR.package.userID}`;
            let count = await app.mysql.query(sql2);
            result.push(count[0].number)

            return { success: true, data: '留言获取成功', package: result };
        } catch (err) {
            throw err;
        }
    }
    //管理员获取用户自己的留言
    async getUserBoardA(data) {
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
                return this.setStatus(false, '非管理员禁止访问');
            }
            let { queryAfter, number } = ctx.helper.reqParamSet(data);
            let sql = `
            select a.id,a.userContent,a.replyContent,a.time,b.userNickName
            from user_verify as b,user_message as a
            where a.userID=b.userID order by a.id desc 
            limit ${queryAfter},${number}
            `;
            // const result = await app.mysql.select('user_message', {
            //     columns: ['id', 'userContent', 'replyContent', 'time'],
            //     orders: [
            //         ['id', 'desc']
            //     ],
            //     limit: number,
            //     offset: queryAfter
            // });
            const result = await app.mysql.query(sql);
            let sql2 = `select count(id)as number from user_message`;
            let count = await app.mysql.query(sql2);
            result.push(count[0].number)

            return { success: true, data: '留言获取成功', package: result };
        } catch (err) {
            throw err;
        }
    }
    //管理员回复
    async sendReply(data) {
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
                return this.setStatus(false, '非管理员禁止访问');
            }
            let userIDR = await ctx.service.user.getUserIDByToken();

            const result = await app.mysql.update('user_message', {
                replyID: userIDR.package.userID,
                replyContent: data.content,
            }, {
                    where: {
                        id: parseInt(data.id)
                    }
                });
                if (result.affectedRows === 1) {
                    return { success: true, data: '回复成功' };
    
                }
                return { success: false, data: '回复失败' };
        } catch (err) {
            throw err;
        }
    }
};
module.exports = AaService;