module.exports = {
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {   
      config.entry("app").clear().add("./src/main-prod.js")
    }
    config.when(process.env.NODE_ENV === "development", config => {
      config.entry("app").clear().add("./src/main.js")
    })
  },
  devServer: {
    open: true
  },
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        args[0].title = '你的应用的名字';
        return args;
      });
  },
  pwa: {
    iconPaths: {
      favicon32: 'favicon.png',
      favicon16: 'favicon.png',
      appleTouchIcon: 'favicon.png',
      maskIcon: 'favicon.png',
      msTileImage: 'favicon.png'
    }

  },

}