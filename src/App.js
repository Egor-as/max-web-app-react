import { useEffect } from 'react';
import './App.css';
import { useMax } from './hooks/useMax';

// ВАЖНО: Проверь, что путь к ProductList правильный! 
// Если он лежит в другой папке, исправь путь.
import ProductList from './components/ProductList/ProductList'; 

function App() {
  const { mx, user } = useMax();

  useEffect(() => {
    if (mx) {
      mx.ready();
      if (mx.expand) mx.expand();
      console.log('✅ Max инициализирован. Пользователь:', user);
    }
  }, [mx, user]);

  // 🔥 ПРЯМОЙ РЕНДЕР: Никаких роутов и дебаг-кнопок
  return (
    <div className="App" style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h2 style={{ color: 'black' }}>Если ты это видишь, React работает!</h2>
      <ProductList />
    </div>
  );
}

export default App;