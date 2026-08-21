import { useEffect } from 'react'; // Убрали неиспользуемый useState
import './App.css';

// ВНИМАНИЕ: Убедись, что мессенджер Max использует именно window.WebApp. 
// Если их SDK называется иначе (например, window.MaxWebApp), измени это название.
const mx = window.WebApp;

function App() {
  // Безопасно извлекаем данные. initDataUnsafe подходит ТОЛЬКО для отображения на фронтенде.
  // Для авторизации на бэкенде нужно использовать подписанную строку mx.initData
  const initDataUnsafe = mx?.initDataUnsafe || {};
  const user = initDataUnsafe.user;
  const chat = initDataUnsafe.chat;
  const startParam = initDataUnsafe.start_param;

  useEffect(() => {
    // Сообщаем мессенджеру, что приложение готово к отображению
    if (mx) {
      mx.ready();
      
      // Разворачиваем приложение на весь экран (рекомендуемая практика для мини-аппов)
      if (mx.expand) {
        mx.expand();
      }

      // Логируем данные для отладки
      if (user) {
        console.log('MAX Web App инициализирован');
        console.log('ID пользователя:', user.id);
        console.log('Имя:', user.first_name);
        console.log('Язык:', user.language_code);
        console.log('Тип чата:', chat?.type);
        console.log('Параметр запуска:', startParam);
      } else {
        console.warn('Данные пользователя не найдены в initDataUnsafe');
      }
    } else {
      console.error('Объект WebApp не найден. Приложение запущено вне мессенджера?');
    }
    // Эффект должен сработать только один раз при монтировании
  }, []); 

  const onClose = () => {
    if (mx?.close) {
      mx.close();
    } else {
      console.log('Метод close() недоступен');
    }
  };

  return (
    <div className="App">
      <h1>MAX Web App</h1>
      
      {user ? (
        <div>
          {/* Аккуратное форматирование имени и фамилии без лишних пробелов */}
          <p>
            Привет, {user.first_name}{user.last_name ? ` ${user.last_name}` : ''}!
          </p>
          <p>ID: {user.id}</p>
          <p>Username: @{user.username || 'не указан'}</p>
          
          {chat && <p>Открыто в: {chat.type}</p>}
          {startParam && <p>Параметр запуска: {startParam}</p>}
        </div>
      ) : (
        <p style={{ color: 'red' }}>
          Данные пользователя недоступны. Убедитесь, что приложение открыто внутри мессенджера Max.
        </p>
      )}
      
      <button onClick={onClose} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Закрыть приложение
      </button>
    </div>
  );
}

export default App;