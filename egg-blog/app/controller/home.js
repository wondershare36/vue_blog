'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.cookies.set("cookie","123456")
    ctx.body = 'hi, egg';
  }
  async login() {
    console.log(this.ctx.request.body)
    var username = this.ctx.request.body.username;
    var password = this.ctx.request.body.password;
    //密码md5加密
    // var password = await this.service.tools.md5(this.ctx.request.body.password);
    var code = this.ctx.request.body.verify;
  
      var result = await this.app.mysql.select("t_user",{
        where:{username:username,password:password},
        columns:["id","username"]
      });
      console.log("查询数据库的用户密码")
      console.log(result)
      if(result.length>0){
        //登录成功
        // 1.保存用户信息
        this.ctx.session.token = result[0].username;

        this.ctx.body=this.ctx.responseData("登录成功",200,result[0])
      }else{
        this.ctx.body=this.ctx.responseData("登录失败",400,null)
      }
  
  }
}

module.exports = HomeController;
