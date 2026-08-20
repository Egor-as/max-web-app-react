import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';           // глобальные стили (опционально)
import App from './App';
import { CartProvider } from './components/CartContext';

// Проверяем, что приложение запущено внутри MAX (для отладки)
if (window.WebApp) {
  window.WebApp.ready();
  console.log('Mini App запущено в MAX');
} else {
  console.warn('Приложение запущено вне MAX');
}

// Создаём корневой элемент React
const root = ReactDOM.createRoot(document.getElementById('root'));

// Рендерим приложение, обёрнутое в провайдер корзины
root.render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);
