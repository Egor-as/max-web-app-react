import { useEffect, useState } from 'react';
import './App.css';
import { useMax } from './hooks/useMax';
import ProductList from './components/ProductList/ProductList';
import Form from './components/Form/Form';

function App() {
  const { mx, user } = useMax();
  const [currentScreen, setCurrentScreen] = useState('products');
  
  // 🔥 Корзина теперь здесь — доступна обоим экранам
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (mx) {
      mx.ready();
      if (mx.expand) mx.expand();
    }
  }, [mx, user]);

  // Функция перехода к форме (сохраняет текущую корзину)
  const handleNavigateToForm = () => {
    setCurrentScreen('form');
  };

  // Функция возврата к товарам
  const handleBackToProducts = () => {
    setCurrentScreen('products');
  };

  return (
    <div className="App">
      {currentScreen === 'products' && (
        <ProductList 
          cartItems={cartItems}
          setCartItems={setCartItems}
          onNavigateToForm={handleNavigateToForm}
        />
      )}
      
      {currentScreen === 'form' && (
        <Form 
          cartItems={cartItems}
          setCartItems={setCartItems}
          onBack={handleBackToProducts}
        />
      )}
    </div>
  );
}

export default App;