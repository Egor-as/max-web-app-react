import { useEffect, useState } from 'react';
import './App.css';
import { useMax } from './hooks/useMax';

import MainMenu from './components/MainMenu/MainMenu';
import CategoryList from './components/CategoryList/CategoryList';
import ProductList from './components/ProductList/ProductList';
import Form from './components/Form/Form';
import Specialist from './components/Specialist/Specialist';

function App() {
  const { mx } = useMax();
  
  // Экраны: 'main' → 'categories' → 'products' → 'form'
  const [currentScreen, setCurrentScreen] = useState('main');
  const [cartItems, setCartItems] = useState([]);
  
  // 🔥 Состояние каталога
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (mx) {
      mx.ready();
      if (mx.expand) mx.expand();
    }
    
    // 🔥 Загружаем категории с сервера
    fetchCategories();
  }, [mx]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.warn('⚠️ Не удалось загрузить категории, используем заглушку');
      // Заглушка на случай, если сервер недоступен
      setCategories([
        { id: 'online-kassy', title: 'Онлайн-кассы', icon: '💰', description: 'Фискальные регистраторы' },
        { id: 'printery-etiketok', title: 'Принтеры этикеток', icon: '🖨️', description: 'Термо и термотрансферные' },
        { id: 'skanery', title: 'Сканеры штрих-кода', icon: '📷', description: '1D и 2D сканеры' },
        { id: '1s', title: '1С', icon: '📊', description: 'Лицензии и конфигурации' },
        { id: 'rasprodazha', title: 'Распродажа', icon: '🔥', description: 'Товары со скидками' }
      ]);
    }
  };

  const fetchProductsByCategory = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/products?categoryId=${categoryId}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.warn('⚠️ Не удалось загрузить товары');
      setProducts([]);
    }
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    fetchProductsByCategory(category.id);
    setCurrentScreen('products');
  };

  return (
    <div className="App">
      {currentScreen === 'main' && (
        <MainMenu onNavigate={setCurrentScreen} />
      )}

      {currentScreen === 'categories' && (
        <CategoryList 
          categories={categories}
          onSelectCategory={handleSelectCategory}
          onNavigateToMain={() => setCurrentScreen('main')}
        />
      )}
      
      {currentScreen === 'products' && (
        <ProductList 
          category={selectedCategory}
          products={products}
          cartItems={cartItems}
          setCartItems={setCartItems}
          onNavigateToForm={() => setCurrentScreen('form')}
          onBackToCategories={() => setCurrentScreen('categories')}
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