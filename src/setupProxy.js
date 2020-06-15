const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use('/service', createProxyMiddleware({
    target: 'https://www.zghnrc.gov.cn',
    pathRewrite: {
      '^/service': '/service'
    },
    headers: {
      referer: 'https://www.zghnrc.gov.cn'
    },
    changeOrigin: true,
    secure: false,
    timeout: 10000,
    logLevel: 'debug'
  }));
  app.use('/socket.io', createProxyMiddleware({
    target: 'http://localhost/',
    changeOrigin: true,
    timeout: 10000,
    ws: true // 代理webSocket
  }));
};
