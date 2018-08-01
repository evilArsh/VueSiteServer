'use strict';
const path = require('path');
const fs = require('fs');

const Controller = require('egg').Controller;
class ResourcesController extends Controller {
    constructor(ctx) {
        super(ctx);
        this.uploadRule={
            id:{type:'number',required:true}
        }
    }
    async show() {
        // this.app.config.static.dir
        const { ctx, app } = this;
        const uri = ctx.params.id;
        try { 
            var baseDir = this.app.baseDir + '\\';
            baseDir = app.config.sourceDir;
            const filePath = path.resolve(baseDir, uri);
            fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK);
            this.ctx.attachment(uri);
            this.ctx.set('Content-Type', 'application/octet-stream');//修改---del
            this.ctx.body = fs.createReadStream(filePath);
        } catch (err) {
            this.ctx.set('Content-Type', 'text/json');
            this.ctx.body = {
                success: 'false',
                data: '不存在此资源'
            }
        }
    }
    async create(){
        const { ctx, app } = this;
        try {
            ctx.body=await ctx.service.file.upLoadImg();
        } catch (err) {
            console.log(err);
            
            ctx.body=ctx.app.errorUserAvatar();
        }
    }
}
module.exports = ResourcesController;