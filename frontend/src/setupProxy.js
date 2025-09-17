const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // ✅ Hanya permintaan yang diawali dengan '/api' yang akan diteruskan ke backend
    createProxyMiddleware({
      target: 'http://192.168.10.106:5000', // Sesuaikan dengan alamat IP & port backend Anda
      changeOrigin: true,
    })
  );
};