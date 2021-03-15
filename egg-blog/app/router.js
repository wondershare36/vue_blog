'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/login', controller.home.login);
  router.get('/article/class', controller.article.getClass);
  router.get('/article/class/:id', controller.article.getClassById);
  router.post('/article/class', controller.article.addClass);
  router.delete('/article/class/:id', controller.article.deleteClass);
  router.put('/article/class/:id', controller.article.updateClass);
  router.get('/article/list', controller.article.getArticleList); 

  
  router.get('/article/list/:id', controller.article.getArticleById); //根据id获取文章
  router.post('/article/list/:class_id', controller.article.addArticle); //添加文章
  router.delete('/article/list/:id', controller.article.detleteArticle); //删除文章
  router.put('/article/list/:id/:class_id', controller.article.updateArticle); //修改文章
  router.get('/getMenuList', controller.article.getMenuList); //获取左侧菜单列表

  router.put('/article/list/save/:id/:class_id', controller.article.tempSaveArticle); //暂存文章

};
