import { useEffect, useState } from 'react';
import './App.css';
import { useMax } from './hooks/useMax';
import { useApi } from './hooks/useApi';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useWishlist } from './hooks/useWishlist';
import { useComparison } from './hooks/useComparison';

import MainMenu from './components/MainMenu/MainMenu';
import CategoryList from './components/CategoryList/CategoryList';
import ProductList from './components/ProductList/ProductList';
import ProductDetail from './components/ProductDetail/ProductDetail';
import Form from './components/Form/Form';
import Specialist from './components/Specialist/Specialist';
import Account from './components/Account/Account';
import Admin from './components/Admin/Admin';
import MyOrders from './components/MyOrders/MyOrders';
import Wishlist from './components/Wishlist/Wishlist';
import Comparison from './components/Comparison/Comparison';

function App() {
  const { mx, user } = useMax();
  const { request } = useApi();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { comparison, addToComparison, removeFromComparison, isInComparison } = useComparison();

  const [currentScreen, setCurrentScreen] = useState('main');
  const [cartItems, setCartItems] = useLocalStorage('cartItems', []);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка данных с бэкенда при старте
  useEffect(() => {
    loadData();
    if (mx) {
      mx.ready();
      if (mx.expand) mx.expand();
    }
  }, [mx]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        request('/api/categories'),
        request('/api/products')
      ]);
      setCategories(categoriesRes.categories || []);
      setProducts(productsRes.products || []);
    } catch (error) {
      console.error('Ошибка загрузки данных с сервера:', error);
      alert('Не удалось загрузить каталог. Проверьте подключение к серверу.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setCurrentScreen('products');
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentScreen('productDetail');
  };

  const updateCartQuantity = (product, delta) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (delta > 0) {
        if (existingItem) {
          return prevItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prevItems, { ...product, quantity: 1 }];
      } else {
        if (existingItem && existingItem.quantity > 1) {
          return prevItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          );
        }
        return prevItems.filter(item => item.id !== product.id);
      }
    });
  };

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleAddProduct = (newProduct) => {
    setProducts(prev => [...prev, newProduct]);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCartItems(prev => prev.filter(i => i.id !== productId));
  };

  // Экран загрузки
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Загрузка каталога...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {currentScreen === 'main' && (
        <MainMenu
          onNavigate={setCurrentScreen}
          userName={user?.first_name}
        />
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
          products={products.filter(p => p.categoryId === selectedCategory?.id)}
          cartItems={cartItems}
          setCartItems={setCartItems}
          onNavigateToForm={() => setCurrentScreen('form')}
          onBackToCategories={() => setCurrentScreen('categories')}
          onProductClick={handleSelectProduct}
        />
      )}

      {currentScreen === 'productDetail' && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          quantity={cartItems.find(i => i.id === selectedProduct.id)?.quantity || 0}
          onUpdateQuantity={updateCartQuantity}
          onBack={() => setCurrentScreen('products')}
          onAddToCart={handleAddToCart}
          onAddToWishlist={() => {
            if (isInWishlist(selectedProduct.id)) {
              removeFromWishlist(selectedProduct.id);
            } else {
              addToWishlist(selectedProduct);
            }
          }}
          isInWishlist={isInWishlist(selectedProduct.id)}
          onAddToComparison={() => {
            if (isInComparison(selectedProduct.id)) {
              removeFromComparison(selectedProduct.id);
            } else {
              addToComparison(selectedProduct);
            }
          }}
          isInComparison={isInComparison(selectedProduct.id)}
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

      {currentScreen === 'account' && (
        <Account onBack={() => setCurrentScreen('main')} />
      )}

      {currentScreen === 'admin' && (
        <Admin
          products={products}
          categories={categories}
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleDeleteProduct}
          onBack={() => setCurrentScreen('main')}
        />
      )}

      {currentScreen === 'my-orders' && (
        <MyOrders onBack={() => setCurrentScreen('main')} />
      )}

      {currentScreen === 'wishlist' && (
        <Wishlist
          onBack={() => setCurrentScreen('main')}
          onAddToCart={handleAddToCart}
          onNavigateToProduct={(product) => {
            setSelectedProduct(product);
            setCurrentScreen('productDetail');
          }}
        />
      )}

      {currentScreen === 'comparison' && (
        <Comparison
          onBack={() => setCurrentScreen('main')}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}

export default App;