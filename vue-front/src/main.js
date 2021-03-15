import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/fonts/iconfont.css'
import './assets/css/global.css'
import nprogress from "nprogress"
import "nprogress/nprogress.css"//进度条
import axios from 'axios'

axios.defaults.baseURL = 'http://dasabi999.top:7001/'
// axios.defaults.baseURL = 'http://localhost:7001/'
axios.interceptors.request.use(config => {//展示进读条
  nprogress.start();
  return config
})
axios.interceptors.response.use(config => {//隐藏进读条
  nprogress.done();
  return config
})
// 挂在到Vue实例，后面可通过this调用
Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
