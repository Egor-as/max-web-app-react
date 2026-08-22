import React, { useState, useCallback } from 'react';
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

// Добавляем пропс onNavigateToForm
const ProductList = ({ onNavigateToForm }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { mx, queryId } = useMax();

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
    }, [mx]);

    const onSendData = useCallback(async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const payload = {
                items: cartItems.map(item => ({ 
                    id: item.id, 
                    quantity: item.quantity 
                })),
                queryId,
            };

            const response = await fetch('https://85.119.146.179:8000/web-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Заказ успешно оформлен!', result);

            setCartItems([]);
            
            if (mx?.showAlert) {
                mx.showAlert({ message: 'Заказ успешно оформлен! Спасибо за покупку 🎉' });
            } else {
                alert('Заказ успешно оформлен! Спасибо за покупку 🎉');
            }
            
            if (mx?.close) mx.close();

        } catch (error) {
            console.error('❌ Ошибка при отправке заказа:', error);
            
            if (mx?.showAlert) {
                mx.showAlert({ message: 'Не удалось оформить заказ. Попробуйте позже.' });
            } else {
                alert(`Не удалось оформить заказ: ${error.message}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [cartItems, isSubmitting, mx, queryId]);

    const total = getTotalPrice(cartItems);
    const isCartEmpty = cartItems.length === 0;

    return (
        <div className="list">
            <h2 style={{ marginBottom: '20px' }}>Наши товары</h2>
            
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

            {!isCartEmpty && (
                <div className="bottom-action-bar">
                    {/* Кнопка перехода к форме */}
                    <button 
                        className="form-button"
                        onClick={onNavigateToForm}
                        disabled={isSubmitting}
                    >
                        Оформить доставку →
                    </button>
                    
                    {/* Кнопка отправки заказа */}
                    <button 
                        className="custom-main-button"
                        onClick={onSendData}
                        disabled={isSubmitting}
                    >
                        {isSubmitting 
                            ? 'Оформление...' 
                            : `Оформить заказ на ${total.toLocaleString('ru-RU')} ₽`
                        }
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductList;