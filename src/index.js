import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';           // глобальные стили (опционально)
import App from './App';
import { CartProvider } from './components/CartContext';

// Проверяем, что приложение запущено внутри MAX (для отладки)
if (window.WebApp) {
  // Можно выполнить дополнительные действия при готовности WebApp
  window.WebApp.ready();        // сообщает платформе, что приложение готово
  console.log('Mini App запущено в MAX');
} else {
  console.warn('Приложение запущено вне MAX, некоторые функции могут не работать');
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
