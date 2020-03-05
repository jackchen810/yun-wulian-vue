require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

devMiddleware.waitUntilValid(function () {
    console.log('> Listening at 本地调试接口：' + uri + '\n');
    console.log('> 本地调试，用户名：admin 密码：123456\n');
    console.log('> 本地调试注意：yun-wulian后端启动\n');
    console.log('> 本地调试备忘：登录用户名密码在后端yun-wulian中初始到数据库\n');
    console.log('> 本地调试备忘：服务器部署时，前后台运行在一起，使用80端口；本地调试运行时，后台运行在80端口，前台运行在8110端口\n');
    console.log('> 本地调试备忘：本地调试试验8110端口；服务器运行需要编译后挂到yun-wulian后端80端口下\n');
    console.log('> 本地调试备忘：emqtt Web 管理控制台 http://yun.jdwanxiang.com:18083\n');
    console.log('> 本地调试备忘：emqtt Web 管理控制台 默认用户: admin，密码：public\n');

});

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return
  }

  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
});
