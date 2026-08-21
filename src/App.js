import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { useMax } from './hooks/useMax';
import ProductList from './components/ProductList/ProductList';
import Form from './components/Form/Form';

function App() {
  const { mx, user, onClose } = useMax();
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    if (mx) {
      mx.ready();
      if (mx.expand) mx.expand();
      
      // Диагностика (можно убрать потом)
      console.log('✅ Max инициализирован');
      console.log('Пользователь:', user);
    }
  }, [mx, user]);

  // Временная кнопка для показа диагностики (нажми, если нужно проверить)
  if (showDebug) {
    return (
      <div style={{ padding: '20px', fontSize: '14px' }}>
        <h3>Диагностика:</h3>
        <pre style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          {JSON.stringify({
            windowWebApp: !!window.WebApp,
            user: user,
            url: window.location.href,
          }, null, 2)}
        </pre>
        <button onClick={() => setShowDebug(false)} style={{ marginTop: '20px', padding: '10px 20px' }}>
          Вернуться к магазину
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Кнопка диагностики (можно убрать потом) */}
      <button 
        onClick={() => setShowDebug(true)}
        style={{ 
          position: 'fixed', 
          top: '10px', 
          right: '10px', 
          padding: '5px 10px',
          fontSize: '12px',
          zIndex: 9999
        }}
      >
        Debug
      </button>

      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/form" element={<Form />} />
      </Routes>
    </div>
  );
}

export default App;