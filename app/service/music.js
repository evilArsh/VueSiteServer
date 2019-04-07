'use strict';
const Service = require('egg').Service;
class MusicService extends Service {
    //轮播
    async getBanner() {
        const { ctx, app } = this;
        try {
            const result = await app.mysql.select('music_all', {
                columns:
                    ['id', 'music_name',
                        'singer_name', 'image_url', 'music_url', 'type', 'upload_time',
                        'is_banner', 'is_recommend', 'play_time'],
                orders: [
                    ['id', 'desc']
                ],
                where: {
                    'is_banner': 'y'
                }
            });
            if (result.length) {
                return ctx.helper.msg(true, 'Banner数据成功', result);
            }
            return ctx.helper.msg(false, 'Banner数据失败');
        } catch (err) {
            throw err;
        }
    }
    //推荐
    async getRecommend(queryAfter, number) {
        const { ctx, app } = this;
        try {
            queryAfter = parseInt(queryAfter);
            number = parseInt(number);
            const result = await app.mysql.select('music_all', {
                columns:
                    ['id', 'music_name',
                        'singer_name', 'image_url', 'music_url', 'type', 'upload_time',
                        'is_banner', 'is_recommend', 'play_time'],
                orders: [
                    ['id', 'desc']
                ],
                where: {
                    'is_recommend': 'y'
                },
                limit: number,
                offset: queryAfter
            });
            // let sql = `select count(id)as number from music_all where is_recommend='y'`;
            // let count = await app.mysql.query(sql);
            // result.push(count[0].number)
            if (result.length) {
                return ctx.helper.msg(true, `热门推荐数据成功`, result);
            }
            return ctx.helper.msg(false, `热门推荐数据失败`);
        } catch (err) {
            throw err;
        }
    }
    //获取热门歌曲
    async getHot(number) {
        const { ctx, app } = this;
        try {
            number = parseInt(number);
            const result = await app.mysql.select('music_all', {
                columns:
                    ['id', 'music_name',
                        'singer_name', 'image_url', 'music_url', 'type', 'upload_time',
                        'is_banner', 'is_recommend', 'play_time'],
                orders: [
                    ['play_time', 'desc']
                ],
                limit: number
            });
            if (result.length) {
                return ctx.helper.msg(true, `热门单曲数据成功`, result);
            }
            return ctx.helper.msg(false, `热门单曲数据失败`);
        } catch (err) {
            throw err;
        }
    }
    //获取最新单曲
    async getNew(number) {
        const { ctx, app } = this;
        try {
            number = parseInt(number);
            const result = await app.mysql.select('music_all', {
                columns:
                    ['id', 'music_name',
                        'singer_name', 'image_url', 'music_url', 'type', 'upload_time',
                        'is_banner', 'is_recommend', 'play_time'],
                orders: [
                    ['id', 'desc']
                ],
                limit: number
            });
            if (result.length) {
                return ctx.helper.msg(true, `最新单曲数据成功`, result);
            }
            return ctx.helper.msg(false, `最新单曲数据失败`);
        } catch (err) {
            throw err;
        }
    }
    //获取音乐
    async getMusic(type, queryAfter, number) {
        const { ctx, app } = this;
        try {
            queryAfter = parseInt(queryAfter);
            number = parseInt(number);
            const result = await app.mysql.select('music_all', {
                columns:
                    ['id', 'music_name',
                        'singer_name', 'image_url', 'music_url', 'type', 'upload_time',
                        'is_banner', 'is_recommend', 'play_time'],
                orders: [
                    ['id', 'desc']
                ],
                where: {
                    'type': type
                },
                limit: number,
                offset: queryAfter
            });
            let sql = `select count(id)as number from music_all where type='${type}'`;
            let count = await app.mysql.query(sql);
            result.push(count[0].number)
            if (result.length) {
                return ctx.helper.msg(true, `${type}数据成功`, result);
            }
            return ctx.helper.msg(false, `${type}数据失败`);
        } catch (err) {
            throw err;
        }
    }
    async updateMusic(id, data) {
        const {
            ctx,
            app
        } = this;
        try {
            let { music_name, singer_name } = data;
            //插入数据库
            let rst = await app.mysql.update('music_all', {
                music_name: music_name,
                singer_name: singer_name
            }, {
                    where: {
                        id: id
                    }
                });
            if (rst.affectedRows === 1) {
                return ctx.helper.msg(true, '更新成功')
            }
            return ctx.helper.msg(false, '更新失败')
        } catch (err) {
            throw err;
        }
    }
    //创建音乐
    async createMusic(data) {
        const {
            ctx,
            app
        } = this;
        try {
            let rst = await app.mysql.insert('music_all', {
                'music_name': data.music_name,
                'singer_name': data.singer_name,
                'image_url': data.image_url,
                'music_url': data.music_url,
                'type': data.type,
                'is_banner': 'n',
                'is_recommend': 'n',
                'content': data.content,
                'play_time': 0,
                'upload_time': ctx.helper.dateFormate('yyyy-MM-dd', new Date())
            });
            if (rst.affectedRows === 1) {
                return ctx.helper.msg(true, '上传成功')
            }
            return ctx.helper.msg(false, '上传失败')
        } catch (err) {
            throw err;
        }
    }
    //删除音乐
    async delMusic(id) {
        const { ctx, app } = this;
        id = parseInt(id);
        try {
            const result = await app.mysql.delete('music_all', {
                id: id
            });
            if (result.affectedRows === 1) {
                return ctx.helper.msg(true, `删除成功_${id}`);
            }
            return ctx.helper.msg(false, `删除失败_${id}`);
        } catch (err) {
            throw err;
        }
    }
    //banner是否展示开关 
    async toggleBanner(id, is) {
        const {
            ctx,
            app
        } = this;
        try {
            id = parseInt(id);
            let rst = await app.mysql.update('music_all', {
                'is_banner': is
            }, {
                    where: {
                        id: id
                    }
                });
            if (rst.affectedRows === 1) {
                return ctx.helper.msg(true, `设置成功_${id}`)
            }
            return ctx.helper.msg(false, `设置失败_${id}`)
        } catch (err) {
            throw err;
        }
    }
    //热门推荐是否展示开关 
    async toggleRecommend(id, is) {
        const {
            ctx,
            app
        } = this;
        try {
            id = parseInt(id);
            let rst = await app.mysql.update('music_all', {
                'is_recommend': is
            }, {
                    where: {
                        id: id
                    }
                });
            if (rst.affectedRows === 1) {
                return ctx.helper.msg(true, `设置成功_${id}`)
            }
            return ctx.helper.msg(false, `设置失败_${id}`)
        } catch (err) {
            throw err;
        }
    }
    //计数
    async addPlayNum(id) {
        const { ctx, app } = this;
        try {
            id = parseInt(id);
            var sql = `update music_all set play_time=play_time+1 where id=${parseInt(id)}`
            let count = await app.mysql.query(sql);
            console.log(count.affectedRows)
        } catch (err) {
            throw err;
        }
    }
    async getMusicContent(id) {
        const { ctx, app } = this;
        try {
            id = parseInt(id);
            const result = await app.mysql.select('music_all', {
                columns:
                    ['id', 'music_name',
                        'singer_name', 'image_url', 'music_url', 'type', 'upload_time',
                        'is_banner', 'is_recommend', 'play_time', 'content'],
                where: {
                    'id': id
                }
            });
            if (result.length) {
                return ctx.helper.msg(true, `单个数据成功`, result[0]);
            }
            return ctx.helper.msg(false, `数据获取失败`)
        } catch (err) {
            throw err;
        }
    }
    async getComment(id) {
        const { ctx, app } = this;
        try {
            id = parseInt(id);
            console.log('音乐id:',id);
            const result = await app.mysql.select('music_comment', {
                columns:
                    ['id', 'time',
                        'content', 'nickname'],
                where: {
                    'music_id': id
                }
            });
            return ctx.helper.msg(true, `评论数据成功`, result);
        } catch (err) {
            throw err;
        }
    }
    async createComment(data) {
        const {
            ctx,
            app
        } = this;
        try {
            let rst = await app.mysql.insert('music_comment', {
                'music_id':parseInt(data.music_id),
                'nickname': data.nickname || '音乐用户',
                'content': data.content,
                'time': ctx.helper.dateFormate('yyyy-MM-dd', new Date())
            });
            if (rst.affectedRows === 1) {
                return ctx.helper.msg(true, '留言成功')
            }
            return ctx.helper.msg(false, '留言失败')
        } catch (err) {
            throw err;
        }
    }
}
module.exports = MusicService;