'use strict';
var crypto = require('crypto');
module.exports = {
    // 格式化时间
    // author  from internet
    //yyyy-MM-dd hh:mm:ss
    dateFormate(fmt, date) {
        const o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (const k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            }
        }
        return fmt;
    },
    //ctx.query 变为整形，只是单纯的‘123’转换为123
    //data: JSON
    toNumber(data) {
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'object') {
                this.toNumber(data[key]);
            } else if (typeof data[key] !== 'number') {
                if(isNaN(data[key])){
                    throw new Error('转换的字符串中不能包含非数字字符')
                }
                data[key] = parseInt(data[key]);
            }
        });
    },
    // dateCalc(date) {

    // },
    // 邮箱验证
    verifyMail(mail) {
        const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+.([a-zA-Z0-9_-])+$/;
        if (!reg.test(mail)) {
            throw this.app.config.status.ERROR_MAIL_FORMATE;
        }
    },
    // xss过滤
    // param required JSON
    //---del {foo:[,,]}
    xssFilter(data) {
        if (typeof data === 'object') {
            Object.keys(data).forEach(key => {
                if (typeof data[key] === 'object') {
                    this.xssFilter(data[key]);
                } else {
                    data[key] = this.escape(data[key]);
                }
            });
        } else {
            return this.escape(data);
        }
    },
    //时间是否过期
    isTimeDelay(old, news, time) {
        time = parseInt(time);
        if (isNaN(time)) {
            time = this.app.config.tokenDelay;
        }
        if (isNaN(parseInt(old)) || isNaN(parseInt(news))) {
            return false;
        }
        return Math.abs(news - old) >= this.app.config.tokenDelay ? true : false;
    },
    //对请求部分数据时body中所带的参数进行处理
    reqParamSet(queryAndNumber) {
        const { app } = this;
        let { queryAfter, number } = queryAndNumber;

        if (!isNaN(queryAfter) && !isNaN(number)) {
            number = number > app.config.defBlogNum ? app.config.defBlogNum : number;
            queryAfter = queryAfter < 0 ? 0 : queryAfter;

        } else {
            queryAfter = 0;
            number = app.config.defBlogNum;
        }
        queryAfter = parseInt(queryAfter);
        number = parseInt(number);
        return { queryAfter, number };
    },
    sha1(str){
        var sha1 = crypto.createHash('sha1');
        sha1.update(str,'utf8');
        str = sha1.digest('hex');
        return str;
    }
};