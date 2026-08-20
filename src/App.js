import React, { useState } from 'react';
import { CartProvider } from './components/CartContext';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import './App.css';

function App() {
  const [page, setPage] = useState('catalog'); // catalog, cart, checkout

  return (
    <CartProvider>
      <div className="app">
        <Header onCartClick={() => setPage('cart')} />
        {page === 'catalog' && <ProductList />}
        {page === 'cart' && (
          <Cart onCheckout={() => setPage('checkout')} />
        )}
        {page === 'checkout' && (
          <Checkout onBack={() => setPage('cart')} />
        )}
      </div>
    </CartProvider>
  );
}

export default App;