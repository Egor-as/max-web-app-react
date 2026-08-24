import { useEffect, useState } from 'react';
import './App.css';
import { useMax } from './hooks/useMax';

import MainMenu from './components/MainMenu/MainMenu';
import ProductList from './components/ProductList/ProductList';
import Form from './components/Form/Form';
import Specialist from './components/Specialist/Specialist';

function App() {
  const { mx, user } = useMax();
  const [currentScreen, setCurrentScreen] = useState('main');
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (mx) {
      mx.ready();
      if (mx.expand) mx.expand();
      console.log('✅ Max инициализирован. Пользователь:', user);
    }
  }, [mx, user]);

  return (
    <div className="App">
      {currentScreen === 'main' && (
        <MainMenu onNavigate={setCurrentScreen} />
      )}
      
      {currentScreen === 'products' && (
        <ProductList 
          cartItems={cartItems}
          setCartItems={setCartItems}
          onNavigateToForm={() => setCurrentScreen('form')}
          onNavigateToMain={() => setCurrentScreen('main')}
        />
      )}
      
      {currentScreen === 'form' && (
        <Form 
          cartItems={cartItems}
          setCartItems={setCartItems}
          onBack={() => setCurrentScreen('products')}
        />
      )}

      {currentScreen === 'specialist' && (
        <Specialist onBack={() => setCurrentScreen('main')} />
      )}
    </div>
  );
}

export default App;