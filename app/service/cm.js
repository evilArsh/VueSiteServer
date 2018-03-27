'use strict';
const Service = require('egg').Service;
class CmService extends Service {
    //设置用户是否为管理员
    setStatus(su, da, pa) {
        var d = {
            success: su,
            data: da,
        };
        if (pa) {
            d.package = pa;
        }
        return d;
    }
    async setIdentify(data) {
        const {
            ctx,
            app
        } = this;
        try {
            var d = data.isAdmin===true ? "Y" : "N";
            console.log('d:'+d);
            
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
    async modifyFood(data) {
        const {
            ctx,
            app
        } = this;
        try {
            let r = await app.mysql.update('food_detail', {
                foodLeft: data.foodLeft,
                foodPrice: data.foodPrice
            }, {
                where: {
                    foodName: data.foodName
                }
            })
            if (r.affectedRows === 1) {
                return this.setStatus(true, "修改成功")
            }
            return this.setStatus(false, "修改失败")

        } catch (err) {
            console.log(err);
            
            return this.setStatus(false, "修改失败")
        }
    }
    async addFood(data) {
        const {
            ctx,
            app
        } = this;
        try {
            let d = await app.mysql.select('food_detail', {
                where: {
                    foodName: data.foodName
                }
            })
            if (d.length !== 0) {
                return this.setStatus(false, "重复的食物名字")
            }
            let res = await app.mysql.insert('food_detail', {
                foodName: data.foodName,
                foodLeft: data.foodLeft,
                foodPrice: data.foodPrice
            })
            if (res.affectedRows === 1) return this.setStatus(true, "添加成功");
            return this.setStatus(true, "添加失败");
        } catch (err) {
            return this.setStatus(true, "添加失败");
        }
    }
    async delFood(data) {
        const {
            ctx,
            app
        } = this;
        try {
            let res = await app.mysql.delete('food_detail', {
                foodName: data.foodName
            })
            if (res.affectedRows === 1) return this.setStatus(true, "删除成功");
            return this.setStatus(false, "删除失败");
        } catch (err) {
            return this.setStatus(false, "删除失败");

        }

    }
    async findFood(data) {
        const {
            ctx,
            app
        } = this;
        try {
            let str = {
                queryAfter: data.queryAfter,
                number: data.number
            };
            let {
                queryAfter,
                number
            } = ctx.helper.reqParamSet(str);
            const result = await app.mysql.select('food_detail', {
                columns: ['foodName', 'foodLeft', 'foodPrice'],
                orders: [
                    ['id', 'desc']
                ],
                limit: number,
                offset: queryAfter
            });
                return this.setStatus(true, "查找成功", result);

        } catch (err) {
            console.log(err);
            
            return this.setStatus(false, "查找失败");
        }

    }
};
module.exports = CmService;