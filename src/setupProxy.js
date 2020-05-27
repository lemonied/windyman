const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use('/api', createProxyMiddleware({
    target: 'http://localhost/',
    changeOrigin: true,
    timeout: 10000
  }));
  app.use('/socket.io', createProxyMiddleware({
    target: 'http://localhost/',
    changeOrigin: true,
    timeout: 10000,
    ws: true // 代理webSocket
  }));
};
