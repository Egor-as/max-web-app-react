import { useEffect } from 'react';
import './App.css';
import { useMax } from './hooks/useMax';
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

  // Прямой рендер без роутинга - это точно работает!
  return (
    <div className="App">
      <ProductList />
    </div>
  );
}

export default App;