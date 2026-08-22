import { useEffect, useState } from 'react';
import './App.css';
import { useMax } from './hooks/useMax';
import ProductList from './components/ProductList/ProductList';
import Form from './components/Form/Form';

function App() {
  const { mx, user } = useMax();
  const [currentScreen, setCurrentScreen] = useState('products'); // 'products' или 'form'

  useEffect(() => {
    if (mx) {
      mx.ready();
      if (mx.expand) mx.expand();
      console.log('✅ Max инициализирован. Пользователь:', user);
    }
  }, [mx, user]);

  return (
    <div className="App">
      {currentScreen === 'products' && (
        <ProductList onNavigateToForm={() => setCurrentScreen('form')} />
      )}
      {currentScreen === 'form' && (
        <Form onBack={() => setCurrentScreen('products')} />
      )}
    </div>
  );
}

export default App;