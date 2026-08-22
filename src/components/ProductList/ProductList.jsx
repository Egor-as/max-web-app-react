import React, { useCallback } from 'react';
import './ProductList.css';
import ProductItem from '../ProductItem/ProductItem';
import { useMax } from '../../hooks/useMax';

const products = [
    { 
        id: '1', 
        title: 'Джинсы', 
        price: 5000, 
        description: 'Синего цвета, прямые', 
        image: '/images/jeans.jpg' 
    },
    { 
        id: '2', 
        title: 'Куртка', 
        price: 12000, 
        description: 'Зеленого цвета, теплая', 
        image: '/images/jacket.jpg' 
    },
];

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};

// Получаем cartItems и setCartItems через пропсы от App
const ProductList = ({ cartItems, setCartItems, onNavigateToForm }) => {
    const { mx } = useMax();

    const updateQuantity = useCallback((product, delta) => {
        if (mx?.HapticFeedback) {
            mx.HapticFeedback.impactOccurred('light');
        }

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
            <h2 style={{ marginBottom: '20px', paddingLeft: '16px' }}>Наши товары</h2>
            
            {products.map(item => {
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
            })}

            {/* 🔥 ОДНА КНОПКА: "Оформить заказ" сразу открывает форму */}
            {!isCartEmpty && (
                <div className="bottom-action-bar">
                    <button 
                        className="custom-main-button"
                        onClick={() => {
                            if (mx?.HapticFeedback) {
                                mx.HapticFeedback.impactOccurred('medium');
                            }
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