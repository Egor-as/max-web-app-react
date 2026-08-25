import React, { useCallback } from 'react';
import './ProductList.css';
import ProductItem from '../ProductItem/ProductItem';
import { useMax } from '../../hooks/useMax';

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};

const ProductList = ({ 
    category,           // ← Текущая категория
    products,           // ← Товары этой категории
    cartItems, 
    setCartItems, 
    onNavigateToForm, 
    onBackToCategories  // ← Кнопка "Назад к категориям"
}) => {
    const { mx } = useMax();

    const updateQuantity = useCallback((product, delta) => {
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('light');

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
    }, [mx, setCartItems]);

    const total = getTotalPrice(cartItems);
    const isCartEmpty = cartItems.length === 0;

    return (
        <div className="list">
            <button className="back-button" onClick={onBackToCategories}>
                ← К категориям
            </button>

            <div style={{ paddingLeft: '16px', marginBottom: '20px' }}>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '24px' }}>
                    {category?.icon} {category?.title}
                </h2>
                <p style={{ margin: 0, color: '#636366', fontSize: '14px' }}>
                    {category?.description} • {products.length} товаров
                </p>
            </div>
            
            {products.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '40px 20px', color: '#636366' }}>
                    В этой категории пока нет товаров
                </p>
            ) : (
                products.map(item => {
                    const cartItem = cartItems.find(ci => ci.id === item.id);
                    const quantity = cartItem ? cartItem.quantity : 0;

                    return (
                        <ProductItem
                            key={item.id}
                            product={item}
                            quantity={quantity}
                            onUpdateQuantity={updateQuantity}
                            className="item"
                        />
                    );
                })
            )}

            {!isCartEmpty && (
                <div className="bottom-action-bar">
                    <button 
                        className="custom-main-button"
                        onClick={() => {
                            if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('medium');
                            onNavigateToForm();
                        }}
                    >
                        Оформить заказ на {total.toLocaleString('ru-RU')} ₽ →
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductList;