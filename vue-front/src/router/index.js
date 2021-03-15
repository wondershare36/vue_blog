import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../components/Home"
import Article from "../components/article/Article.vue"
import ArticleList from "../components/articleList/ArticleList.vue"

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home, redirect: "/home/articleList" },
  {
    path: '/home',
    redirect: "/home/articleList",
    component: Home,
    children: [
      { path: 'article', component: Article },
      { path: 'articleList', component: ArticleList },
    ]
  },

]

const router = new VueRouter({
  routes
})

export default router
