// src/setupProxy.js

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/images', // Прокси для запросов к /images
    createProxyMiddleware({
      target: 'http://localhost:3001', // Ваш бэкенд-сервер на локальном хосте
      changeOrigin: true,
      secure: false, // Отключает проверку SSL для разработки
    })
  );
};
