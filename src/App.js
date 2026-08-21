import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // Импортируем роутинг
import './App.css';
import { useMax } from './hooks/useMax'; 

// Импортируем твои основные экраны (проверь правильность путей!)
import ProductList from './components/ProductList/ProductList';
import Form from './components/Form/Form';

function App() {
  const { mx, user, chat, startParam, onClose } = useMax();

  useEffect(() => {
    if (mx) {
      mx.ready();
      if (mx.expand) mx.expand();

      if (user) {
        console.log('MAX Web App инициализирован');
        console.log('ID:', user.id, 'Имя:', user.first_name);
      } else {
        console.warn('Данные пользователя не найдены в initDataUnsafe');
      }
    } else {
      console.error('Объект WebApp не найден.');
    }
  }, []); // Пустой массив: инициализация происходит строго один раз

  return (
    <div className="App">
      {/* Шапка приложения (опционально, можно добавить твой Header) */}
      {/* <Header onClose={onClose} user={user} /> */}
      
      {/* Маршрутизация: показываем разные экраны в зависимости от URL */}
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/form" element={<Form />} />
        
        {/* Fallback для неизвестных путей */}
        <Route path="*" element={
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Страница не найдена</h2>
            <button onClick={onClose}>Закрыть приложение</button>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;