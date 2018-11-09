'use strict';
const path = require('path');
const fs = require('fs');

const Controller = require('egg').Controller;
class ResourcesController extends Controller {
    constructor(ctx) {
        super(ctx);
        this.uploadRule = {
            accessToken: { type: 'string', required: true }
        }
    }
    //视频流
    //考虑人为修改 Range头后的处理
    video(filePath, type) {
        const { ctx, app } = this;

        if (!(/video/.test(type))) {
            return;
        }
        //1mb/s 默认发送 1048576
        let fileSize = fs.statSync(filePath).size;
            let start = ctx.get('range').substr(ctx.get('range').indexOf('=') + 1, ctx.get('range').indexOf('-') - 1),
                end = ctx.get('range').substr(ctx.get('range').indexOf('-') + 1);
            start = parseInt(start);
            end = parseInt(end);

            if (isNaN(start)) {
                start=0;
            }
            if (isNaN(end)) {
                end = fileSize - 1;
            }
            ctx.status = 206;
            let header = {
                'Accept-Ranges': 'bytes',
                'Content-Type': type,
                'Content-Length': end - start + 1,
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                "cache-control":'public,max-age=31536000'
            };
            ctx.set(header);

            ctx.body = fs.createReadStream(filePath, {
                start: start,
                end: end,
                autoClose:true
            });
        // }
    }
    //文档下载
    doc(filePath, type) {
        const { ctx, app } = this;

        if (/video/.test(type) || /image/.test(type)) {
            return;
        }
        ctx.attachment(uri);

        let header = {
            'Content-Type': type
        };
        ctx.set(header);
        ctx.body = fs.createReadStream(filePath);
    }
    img(filePath, type) {
        const { ctx, app } = this;

        if (!/image/.test(type)) {
            return;
        }

        let header = {
            'Content-Type': type,
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Max-Age': 2592000,
            'Accept-Ranges': 'bytes',
            'Content-Length': parseInt(fs.statSync(filePath).size)
        };
        ctx.set(header);
        ctx.body = fs.createReadStream(filePath);
    }
    async show() {
        // this.app.config.static.dir
        const { ctx, app } = this;
        const uri = ctx.params.id;
        try {
            var baseDir = app.config.sourceDir;
            const filePath = path.resolve(baseDir, uri);

            let extend = filePath.substr(filePath.lastIndexOf('.'));
            let type = '';
            if (app.config.json.hasOwnProperty(extend)) {
                type = app.config.json[extend];
            } else {
                type = 'application/octet-stream';
            }
            fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK);
            // ctx.attachment(uri);
            this.video(filePath, type);
            this.doc(filePath, type);
            this.img(filePath, type);

        } catch (err) {
            console.log(err);

            ctx.set('Content-Type', 'text/json');
            ctx.body = {
                success: 'false',
                data: '不存在此资源'
            }
        }
    }
    //html
    // async create() {
    //     const { ctx, app } = this;
    //     try {
    //         ctx.validate(this.uploadRule, ctx.params)
    //         ctx.body = await ctx.service.file.upLoadImg(ctx.params.accessToken);
    //     } catch (err) {
    //         console.log(err);
    //         ctx.body = ctx.app.errorUserAvatar();
    //     }
    // }
    //mobile
        async create() {
        const { ctx, app } = this;
        try {
            ctx.body = await ctx.service.file.upLoadImgMobile();
        } catch (err) {
            ctx.body = ctx.app.errorUserAvatar();
        }
    }
}
module.exports = ResourcesController;