'use strict';
const Controller = require('egg').Controller;
//curl 127.0.0.1:7001/api/demo |iconv -f utf-8 -t gbk
class DemoController extends Controller {
    constructor(ctx) {
        super(ctx);
    }
    async index() {
        try {
            const { ctx, app } = this;
        } catch (err) {
            console.log(err);
        }
    }
}
module.exports = DemoController;