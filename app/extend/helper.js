'use strict';
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
    xssFilter(data) {
        Object.keys(data).forEach(key => {
            if (data[key] === 'object') {
                this.xssFilter(data[key]);
            } else {
                data[key] = this.escape(data[key]);
            }
        });
    },
    //时间是否过期
    isTimeDelay(old, news, time) {
        time = parseInt(time);
        if (isNaN(time)) {
            time = this.app.config.tokenDelay;
        }
        if (isNaN(parseInt(old)) ||isNaN( parseInt(news))) {
            return false;
        }
        return news - old >= this.app.config.tokenDelay ? true : false;
    },
    //对请求部分数据时body中所带的参数进行处理
    reqParamSet(queryAndNumber) {
        const{app}=this;
        let { queryAfter, number } = queryAndNumber;
        if (!isNaN(queryAfter) && !isNaN(number)) {
            number = number > app.config.defBlogNum ? app.config.defBlogNum : number;
            queryAfter = queryAfter < 0 ? 0 : queryAfter;
        } else {
            queryAfter = 0;
            number = app.config.defBlogNum;
        }
        return { queryAfter, number };
    },
    successUserLogin(info) {
        return {
            success: true,
            status: "001D",
            data: this.app.config.info.SUCCESS_USER_LOGIN,
            package: info
        }
    },
    successUserInfo(info){
        return{
            success:true,
            status:'002D',
            data: this.app.config.info.SUCCESS_USER_INFO,
            package:info
        }
    },
    successUserBlog(info) {
        return {
            success: true,
            status: '003D',
            data: this.app.config.info.SUCCESS_USER_BLOGCONTENT,
            package: info
        }
    },
    successDefBlog(info) {
        return {
            success: true,
            status: '004D',
            data: this.app.config.info.SUCCESS_DEF_BLOGCONTENT,
            package: info
        }
    },
    successTokenSet(info){
        return{
            success: true,
            status: "005D",
            data: this.app.config.info.SUCCESS_TOKEN_SET,
            package:info
        }
    },
    successUserCreate() {
        return {
            success: true,
            status: "001",
            data: this.app.config.info.SUCCESS_USER_CREATE
        }
    },
    errorTokenRequire(){
        return {
            success: false,
            status: "002",
            data: this.app.config.info.SUCCESS_TOKEN_SET
        }
    },
    errorMailFormate() {
        return {
            success: false,
            status: "003",
            data: this.app.config.info.ERROR_MAIL_FORMATE
        }
    },
    errorUserCreate() {
        return {
            success: false,
            status: "004",
            data: this.app.config.info.ERROR_USER_CREATE
        }
    },
    errorUserLogin() {
        return {
            success: false,
            status: "005",
            data: this.app.config.info.ERROR_USER_LOGIN
        }
    },
    errorUserReLogin() {
        return {
            success: false,
            status: "006",
            data: this.app.config.info.ERROR_USER_RELOGIN
        }
    },
    errorUserRegister() {
        return {
            success: false,
            status: "007",
            data: this.app.config.info.ERROR_USER_REGISTER
        }
    },
    errorUserFormate() {
        return {
            success: false,
            status: "008",
            data: this.app.config.info.ERROR_USER_FORMATE
        }
    },
    errorDBHandle() {
        return {
            success: false,
            status: "009",
            data: this.app.config.info.ERROR_DB_HANDLE
        }
    },
    errorBlogContentParam(){
      return{
        success:false,
        status:"010",
        data:this.app.config.info.ERROR_BLOG_CONTENTPARAM
      }
    },
    errorBlogContent(){
      return{
        success:false,
        status:"011",
        data:this.app.config.info.ERROR_BLOG_CONTENT
      }
    },
    errorUserIdentify(){
      return{
        success:false,
        status:"012",
        data:this.app.config.info.ERROR_USER_IDENTIFY
      }
    },
    errorUserInfo(){
      return{
        success:false,
        status:"013",
        data:this.app.config.info.ERROR_USER_INFO
      }
    },
    errorTokenVerify() {
        return {
            success: false,
            status: "014",
            data: this.app.config.info.ERROR_TOKEN_VERIFY
        }
    },
    successTokenVerify(){
        return {
            success: true,
            status: "015",
            data: this.app.config.info.SUCCESS_TOKEN_VERIFY
        }
    },
    successUserLoginOut(){
        return {
            success:true,
            status:'016',
            data:this.app.config.info.SUCCESS_USER_LOGINOUT
        }
    },
    errorUserLoginOut(){
        return {
            success: false,
            status: '017',
            data: this.app.config.info.ERROR_USER_LOGINOUT
        }
    }
};