const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy API calls during development if REACT_APP_API_BASE is not set and backend runs elsewhere.
  const target = process.env.PROXY_API_TARGET || 'http://localhost:8000';
  app.use(
    '/api',
    createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: false
    })
  );
};
