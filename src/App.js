import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { useMax } from './hooks/useMax';
import ProductList from './components/ProductList/ProductList';
import Form from './components/Form/Form';

function App() {
  const { mx, user } = useMax();

  useEffect(() => {
    if (mx) {
      mx.ready();
      if (mx.expand) mx.expand();
      console.log('✅ Max инициализирован. Пользователь:', user);
    }
  }, [mx, user]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/form" element={<Form />} />
      </Routes>
    </div>
  );
}

export default App;