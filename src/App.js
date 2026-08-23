import { useEffect, useState } from 'react';
import './App.css';
import { useMax } from './hooks/useMax';

// Импортируем все экраны
import MainMenu from './components/MainMenu/MainMenu';
import ProductList from './components/ProductList/ProductList';
import Form from './components/Form/Form';
import Specialist from './components/Specialist/Specialist';

function App() {
  const { mx, user } = useMax();
  
  // 🔥 Начинаем с главного меню ('main')
  const [currentScreen, setCurrentScreen] = useState('main');
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (mx) {
      mx.ready();
      if (mx.expand) mx.expand();
    }
  }, [mx, user]);

  return (
    <div className="App">
      {/* Экран 1: Главное меню */}
      {currentScreen === 'main' && (
        <MainMenu onNavigate={setCurrentScreen} />
      )}
      
      {/* Экран 2: Список товаров */}
      {currentScreen === 'products' && (
        <ProductList 
          cartItems={cartItems}
          setCartItems={setCartItems}
          onNavigateToForm={() => setCurrentScreen('form')}
          onNavigateToMain={() => setCurrentScreen('main')}
        />
      )}
      
      {/* Экран 3: Оформление заказа */}
      {currentScreen === 'form' && (
        <Form 
          cartItems={cartItems}
          setCartItems={setCartItems}
          onBack={() => setCurrentScreen('products')}
        />
      )}

      {/* Экран 4: Вызов специалиста */}
      {currentScreen === 'specialist' && (
        <Specialist onBack={() => setCurrentScreen('main')} />
      )}
    </div>
  );
}

export default App;