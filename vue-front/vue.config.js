module.exports = {
  chainWebpack: config => {
    // if (process.env.NODE_ENV === 'production') {   
    //   config.entry("app").clear().add("./src/main-prod.js")
    //   config.set("externals", {
    //     vue: "Vue",
    //     "vue-router": "VueRouter",
    //     axios: "axios",
    //     nprogress: "NProgress",
    //   })
    // }
    // config.when(process.env.NODE_ENV === "development", config => {
    //   config.entry("app").clear().add("./src/main.js")

    // })
  }
}