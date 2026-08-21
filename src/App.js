import { useEffect, useState } from 'react';
import './App.css';

// Получаем глобальный объект MAX Bridge
const mx = window.WebApp;

function App() {
  // Безопасно извлекаем данные из initDataUnsafe (это объект, а не строка)
  const initDataUnsafe = mx?.initDataUnsafe || {};
  const user = initDataUnsafe.user;
  const chat = initDataUnsafe.chat;
  const startParam = initDataUnsafe.start_param;

  useEffect(() => {
    // Сообщаем MAX, что приложение готово к отображению
    if (mx) {
      mx.ready();
      
      // Логируем данные для отладки (используем initDataUnsafe для чтения на фронтенде)
      if (user) {
        console.log('ID пользователя:', user.id);
        console.log('Имя:', user.first_name);
        console.log('Язык:', user.language_code);
        console.log('Тип чата:', chat?.type);
        console.log('Параметр запуска:', startParam);
      }
    }
  }, [user, chat, startParam]);

  const onClose = () => {
    if (mx) {
      mx.close();
    }
  };

  return (
    <div className="App">
      <h1>MAX Web App</h1>
      
      {user ? (
        <div>
          <p>Привет, {user.first_name} {user.last_name || ''}!</p>
          <p>ID: {user.id}</p>
          <p>Username: @{user.username || 'не указан'}</p>
          {chat && <p>Открыто в: {chat.type}</p>}
          {startParam && <p>Параметр запуска: {startParam}</p>}
        </div>
      ) : (
        <p>Данные пользователя недоступны (возможно, запуск вне чата)</p>
      )}
      
      <button onClick={onClose}>Закрыть</button>
    </div>
  );
}

export default App;
