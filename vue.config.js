let proxyObj = {}
    proxyObj['/'] = {
      ws: false,
      target: 'http://localhost:8050',
      changeOrigin: true,
      pathRewrite: {
        '^/': ''
      }
    }
module.exports = {
    devServer:{
        open: true,
        port:8889,
        proxy:proxyObj
    }
}