// src/config.js
// Конфигурация API в зависимости от окружения

const isDevelopment = window.location.hostname === 'localhost';

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:8000'
  : 'https://85.119.146.179:8000'; // Замените на ваш реальный сервер

export const API_URLS = {
  categories: `${API_BASE_URL}/api/categories`,
  products: (categoryId) => `${API_BASE_URL}/api/products${categoryId ? `?categoryId=${categoryId}` : ''}`,
  orders: `${API_BASE_URL}/api/orders`,
  createOrder: `${API_BASE_URL}/web-data`
};