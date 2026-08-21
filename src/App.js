import { useEffect } from 'react';
import './App.css';
import { useMax } from './hooks/useMax';

// 🔥 ЭТОТ ALERT ПОКАЖЕТСЯ СРАЗУ ПРИ ЗАГРУЗКЕ
alert('React загрузился! Сейчас проверим Max...');

function App() {
  const { mx, user, onClose } = useMax();

  useEffect(() => {
    // 🔥 Второй alert, чтобы проверить, работает ли хук
    alert(`Хук useMax отработал!\n\nwindow.WebApp существует: ${!!window.WebApp}\nПользователь есть: ${!!user}`);

    if (mx) {
      mx.ready();
      if (mx.expand) mx.expand();
    }
  }, [mx, user]);

  return (
    <div className="App">
      <h1>MAX Web App</h1>
      
      {user ? (
        <div>
          <p>Привет, {user.first_name}!</p>
          <p>ID: {user.id}</p>
        </div>
      ) : (
        <p style={{ color: 'red' }}>
          Данные пользователя недоступны
        </p>
      )}
      
      <button onClick={onClose}>Закрыть</button>
    </div>
  );
}

export default App;