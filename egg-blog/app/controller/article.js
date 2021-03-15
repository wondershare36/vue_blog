'use strict';

const Controller = require('egg').Controller;

class ArticleController extends Controller {
  /**
   * 分类接口
   */

  //获取分类列表
  async getClass() {
    const { ctx, app } = this;
    const data = await app.mysql.select("t_article_class")
    if (data.length === 0) return ctx.body = ctx.responseData("请求的资源不存在", 404, null)
    ctx.body = ctx.responseData("success", 200, data)
  }
  //根据id获取分类
  async getClassById() {
    const { ctx, app } = this;
    const params = ctx.params;
    if (!params.id) return ctx.body = ctx.responseData("缺少参数 id", 400, null)
    const data = await app.mysql.select("t_article_class", {
      where: { id: params.id },
    })
    if (data.length === 0) return ctx.body = ctx.responseData("请求的资源不存在", 404, null)
    ctx.body = ctx.responseData("success", 200, data[0])
  }
  //增加分类
  async addClass() {
    const { ctx, app, } = this;
    const params = ctx.request.body;
    if (!params.class_name) return ctx.body = ctx.responseData("缺少参数 class_name", 400, null)
    const data = await app.mysql.insert("t_article_class", {
      class_name: params.class_name
    })
    ctx.body = ctx.responseData("success", 201, data)
  }
  //删除分类
  async deleteClass() {
    const { ctx, app } = this;
    const params = ctx.params
    console.log(params);
    if (!params.id) return ctx.body = ctx.responseData("缺少参数 id", 400, null)
    const data = await app.mysql.delete("t_article_class", {
      id: params.id
    })
    if (data.affectedRows < 1) return ctx.body = ctx.responseData("请求的资源不存在", 410, null)
    ctx.body = ctx.responseData("success", 204, data)
  }

  //修改分类
  async updateClass() {
    const { ctx, app } = this;
    const params = ctx.params;
    const body_params = ctx.request.body
    if (!params.id) return ctx.body = ctx.responseData("缺少参数 id", 400, null)
    if (!body_params.class_name) return ctx.body = ctx.responseData("缺少参数 class_name", 400, null)
    const data = await app.mysql.update("t_article_class", {
      id: params.id,
      class_name: body_params.class_name
    })
    if (data.affectedRows < 1) return ctx.body = ctx.responseData("请求的资源不存在", 404, null)
    ctx.body = ctx.responseData("success", 201, data)
  }
  
  /**
  * 列表接口
  */
  //获取文章列表
  async getArticleList() {
    const { ctx, app } = this;
    const data = await app.mysql.query("select id,title,desb,class_id,create_time from t_article")
    ctx.body = ctx.responseData("success", 200, data)
  }

  //根据id获取文章
  async getArticleById() {
    const { ctx, app } = this;
    const params = ctx.params;
    if (!params.id) return ctx.body = ctx.responseData("缺少参数 id", 400, null)
    const data = await app.mysql.select("t_article", {
      where: { id: params.id },
    })
    if (data.length === 0) return ctx.body = ctx.responseData("请求的资源不存在", 404, null)
    ctx.body = ctx.responseData("success", 200, data[0])
  }
  //添加文章
  async addArticle() {
    const { ctx, app, } = this;
    const reqBody = ctx.request.body;
    const insertData = {
      class_id: ctx.params.class_id,
      title: reqBody.title,
      content: reqBody.content,
      desb: reqBody.desb,
      create_time: new Date()
    }
    if (!insertData.class_id) return ctx.body = ctx.responseData("缺少参数 class_id", 400, null)
    if (!insertData.title) return ctx.body = ctx.responseData("缺少参数 title", 400, null)
    if (!insertData.content) return ctx.body = ctx.responseData("缺少参数 content", 400, null)
    const data = await app.mysql.insert("t_article", insertData)
    if (data.affectedRows < 1) return ctx.body = ctx.responseData("请求的资源不存在", 404, null)
    insertData.id = data.insertId
    ctx.body = ctx.responseData("success", 201, insertData)
  }
  //删除文章
  async detleteArticle() {
    const { ctx, app, } = this;
    const reqBody = ctx.request.body;
    const paramData = {
      id: ctx.params.id,
    }
    if (!paramData.id) return ctx.body = ctx.responseData("缺少参数 id", 400, null)
    const data = await app.mysql.query(`select id,title,desb,class_id from t_article where id=${paramData.id}`)
    if (data.affectedRows < 1) return ctx.body = ctx.responseData("请求的资源不存在", 404, null)
    const data2 = await app.mysql.delete("t_article", paramData)
    if (data2.affectedRows < 1) return ctx.body = ctx.responseData("请求的资源不存在", 404, null)
    ctx.body = ctx.responseData("success", 204, data)
  }

  //修改文章
  async updateArticle() {
    const { ctx, app, } = this;
    const reqBody = ctx.request.body;
    const paramData = {
      id: ctx.params.id,
      class_id: ctx.params.class_id,
      title: reqBody.title,
      content: reqBody.content,
      desb: reqBody.desb,
    }
    if (!paramData.id) return ctx.body = ctx.responseData("缺少参数 id", 400, null)
    if (!paramData.class_id) return ctx.body = ctx.responseData("缺少参数 class_id", 400, null)
    if (!paramData.title) return ctx.body = ctx.responseData("缺少参数 title", 400, null)
    if (!paramData.content) return ctx.body = ctx.responseData("缺少参数 content", 400, null)
    const data = await app.mysql.update("t_article", paramData)
    if (data.affectedRows < 1) return ctx.body = ctx.responseData("请求的资源不存在", 404, null)
    ctx.body = ctx.responseData("success", 201, paramData)
  }
  //文章暂存
  async tempSaveArticle() {
    const { ctx, app } = this;
    const { title, content, desb } = ctx.request.body;
    const { id: article_id, class_id } = ctx.params
    if (!article_id) return ctx.body = ctx.responseData("缺少参数 id", 400, null)
    if (!class_id) return ctx.body = ctx.responseData("缺少参数 class_id", 400, null)
    if (!title) return ctx.body = ctx.responseData("缺少参数 title", 400, null)
    if (!content) return ctx.body = ctx.responseData("缺少参数 content", 400, null)
    const insertData = {
      article_id, class_id, title, content, desb,
    }

    //判断暂存文章是否存在
    const data = await app.mysql.select("t_article_temp", {
      where: { article_id }
    })
    //如果不存在,新建文章
    if (data.length < 1) {
      const data1 = await app.mysql.insert("t_article_temp", insertData)
      if (data1.affectedRows < 1) return ctx.body = ctx.responseData("插入文章失败", 500, null)
      ctx.body = ctx.responseData("添加成功", 200, insertData)
    }
    //如果存在,更新文章
    if (data.length === 1) {
      const data1 = await app.mysql.update("t_article_temp", insertData,{
        where:{article_id:data[0].id}
      })
      if (data1.affectedRows < 1) return ctx.body = ctx.responseData("更新文章失败", 500, null)
      ctx.body = ctx.responseData("更新成功", 200, insertData)
    }

  }

  /**
   * 前端接口
   */
  async getMenuList() {
    const { ctx, app } = this;
    let article_class = await app.mysql.select("t_article_class")
    if (article_class.length === 0) return ctx.body = ctx.responseData("请求的资源不存在", 404, null)

    let data = JSON.parse(JSON.stringify(article_class))
    for (let i = 0; i < data.length; i++) {
      const articles = await app.mysql.query(`select id,title,desb,class_id,create_time from t_article where class_id=${data[i].id}`)
      if (articles.length !== 0) {
        data[i].articles = articles
      }
    }

    ctx.body = ctx.responseData("success", 200, data)
  }

}

module.exports = ArticleController;
