'use strict';
module.exports = {
    successUserLogin(info) {
        return {
            success: true,
            status: "001D",
            data: this.config.info.SUCCESS_USER_LOGIN,
            package: info
        }
    },
    successUserInfo(info) {
        return {
            success: true,
            status: '002D',
            data: this.config.info.SUCCESS_USER_INFO,
            package: info
        }
    },
    successUserBlog(info) {
        return {
            success: true,
            status: '003D',
            data: this.config.info.SUCCESS_USER_BLOGCONTENT,
            package: info
        }
    },
    successDefBlog(info) {
        return {
            success: true,
            status: '004D',
            data: this.config.info.SUCCESS_DEF_BLOGCONTENT,
            package: info
        }
    },
    successTokenSet(info) {
        return {
            success: true,
            status: "005D",
            data: this.config.info.SUCCESS_TOKEN_SET,
            package: info
        }
    },
    successUserCreate() {
        return {
            success: true,
            status: "001",
            data: this.config.info.SUCCESS_USER_CREATE
        }
    },
    errorTokenRequire() {
        return {
            success: false,
            status: "002",
            data: this.config.info.ERROR_TOKEN_REQUIRE
        }
    },
    errorMailFormate() {
        return {
            success: false,
            status: "003",
            data: this.config.info.ERROR_MAIL_FORMATE
        }
    },
    errorUserCreate() {
        return {
            success: false,
            status: "004",
            data: this.config.info.ERROR_USER_CREATE
        }
    },
    errorUserLogin() {
        return {
            success: false,
            status: "005",
            data: this.config.info.ERROR_USER_LOGIN
        }
    },
    errorUserReLogin() {
        return {
            success: false,
            status: "006",
            data: this.config.info.ERROR_USER_RELOGIN
        }
    },
    errorUserRegister() {
        return {
            success: false,
            status: "007",
            data: this.config.info.ERROR_USER_REGISTER
        }
    },
    errorUserFormate() {
        return {
            success: false,
            status: "008",
            data: this.config.info.ERROR_USER_FORMATE
        }
    },
    errorDBHandle() {
        return {
            success: false,
            status: "009",
            data: this.config.info.ERROR_DB_HANDLE
        }
    },
    errorBlogContentParam() {
        return {
            success: false,
            status: "010",
            data: this.config.info.ERROR_BLOG_CONTENTPARAM
        }
    },
    errorBlogContent() {
        return {
            success: false,
            status: "011",
            data: this.config.info.ERROR_BLOG_CONTENT
        }
    },
    errorUserIdentify() {
        return {
            success: false,
            status: "012",
            data: this.config.info.ERROR_USER_IDENTIFY
        }
    },
    errorUserInfo() {
        return {
            success: false,
            status: "013",
            data: this.config.info.ERROR_USER_INFO
        }
    },
    errorTokenVerify() {
        return {
            success: false,
            status: "014",
            data: this.config.info.ERROR_TOKEN_VERIFY
        }
    },
    successTokenVerify() {
        return {
            success: true,
            status: "015",
            data: this.config.info.SUCCESS_TOKEN_VERIFY
        }
    },
    successUserLoginOut() {
        return {
            success: true,
            status: '016',
            data: this.config.info.SUCCESS_USER_LOGINOUT
        }
    },
    errorUserLoginOut() {
        return {
            success: false,
            status: '017',
            data: this.config.info.ERROR_USER_LOGINOUT
        }
    },
    errorBlogCreate() {
        return {
            success: false,
            status: '018',
            data: this.config.info.ERROR_BLOG_CREATE
        }
    },

    successBlogCreate() {
        return {
            success: true,
            status: '019',
            data: this.config.info.SUCCESS_BLOG_CREATE
        }
    },
    errorBlogDelete() {
        return {
            success: false,
            status: '020',
            data: this.config.info.ERROR_BLOG_DELETE
        }
    },

    errorUserUpdate() {
        return {
            success: false,
            status: '021',
            data: this.config.info.ERROR_USER_UPDATE
        }
    },
    successUserUpdate() {
        return {
            success: true,
            status: '022',
            data: this.config.info.SUCCESS_USER_UPDATE
        }
    },
    errorUserAvatar() {
        return {
            success: false,
            status: '023',
            data: this.config.info.ERROR_USER_AVATAR
        }
    },
    successUserAvatar(uri) {
        return {
            success: true,
            status: '024',
            data: this.config.info.SUCCESS_USER_AVATAR,
            package:uri
        }
    }
};
