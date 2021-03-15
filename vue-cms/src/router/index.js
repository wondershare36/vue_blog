import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../components/Home"
import ArticleClass from "../components/article/class/ArticleClass"
import ArticleList from "../components/article/list/ArticleList"
import Login from "../components/Login.vue"

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home, redirect: "/login" },
  {path: "/login", component: Login},
  { path: '/home', component: Home},
  {
    path: '/home',
    component: Home,
    children: [
      { path: "/articleClass", component: ArticleClass },
      { path: "/articleList", component: ArticleList },
    ]
  },

]

const router = new VueRouter({
  routes
});

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要反问的路径
  // from 代表从哪个路径跳转而来
  // next是一个函数，表示放行
  // next()
  if (to.path === "/login") return next();
  //获取token
  const token = window.sessionStorage.getItem("token");
  if (token!=="498282023") return next("/login");
  next();
});

export default router
