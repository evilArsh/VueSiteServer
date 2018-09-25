'use strict';
const path = require('path');
const fs = require('fs');

const Controller = require('egg').Controller;
class ResourcesController extends Controller {
    constructor(ctx) {
        super(ctx);
        this.uploadRule = {
            id: { type: 'number', required: true }
        }
    }
    //视频流
    video(filePath, type) {
        const { ctx, app } = this;

        if (!(/video/.test(type))) {
            return;
        }
        // console.log(ctx.get('range'));

        let fileSize = fs.statSync(filePath).size;
        let start = ctx.get('range').substr(ctx.get('range').indexOf('=') + 1, ctx.get('range').indexOf('-') - 1),
            end = ctx.get('range').substr(ctx.get('range').indexOf('-') + 1) || fileSize;
        start = parseInt(start);
        end = parseInt(end);
        // console.log('start',start);
        // console.log('end',end);

        let header = {
            'Accept-Ranges': 'bytes',
            'Content-Type': type,
            'Content-Length': end - start + 1,
            'Content-Range': 'bytes ' + start + '-' + end + '/' + fileSize
        };
        this.ctx.set(header);
        // this.ctx.status=206;
        this.ctx.body = fs.createReadStream(filePath, {
            'satrt': start,
            'end': end
        });
    }
    //文档下载
    doc(filePath, type) {
        const { ctx, app } = this;

        if (/video/.test(type) || /image/.test(type)) {
            return;
        }
        this.ctx.attachment(uri);

        let header = {
            'Content-Type': type
        };
        this.ctx.set(header);
        this.ctx.body = fs.createReadStream(filePath);
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
        this.ctx.set(header);
        this.ctx.body = fs.createReadStream(filePath);
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
            // this.ctx.attachment(uri);
            this.video(filePath, type);
            this.doc(filePath, type);
            this.img(filePath, type);

        } catch (err) {
            console.log(err);

            this.ctx.set('Content-Type', 'text/json');
            this.ctx.body = {
                success: 'false',
                data: '不存在此资源'
            }
        }
    }
    async create() {
        const { ctx, app } = this;
        try {
            ctx.body = await ctx.service.file.upLoadImg();
        } catch (err) {
            console.log(err);

            ctx.body = ctx.app.errorUserAvatar();
        }
    }
}
module.exports = ResourcesController;