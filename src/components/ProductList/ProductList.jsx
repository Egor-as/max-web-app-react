import React, { useState, useCallback } from 'react';
import './ProductList.css';
import ProductItem from '../ProductItem/ProductItem';
import { useMax } from '../../hooks/useMax';

const products = [
    { id: '1', title: 'Джинсы', price: 5000, description: 'Синего цвета, прямые', image: 'https://placehold.co/400x300/e0e0e0/333333?text=Джинсы' },
    { id: '2', title: 'Куртка', price: 12000, description: 'Зеленого цвета, теплая', image: 'https://placehold.co/400x300/e0e0e0/333333?text=Куртка' },
];

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};

const ProductList = () => {
    const [cartItems, setCartItems] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { mx, queryId } = useMax();

    // Умная функция изменения количества
    const updateQuantity = useCallback((product, delta) => {
        // Виброотклик при любом изменении
        if (mx?.HapticFeedback) {
            mx.HapticFeedback.impactOccurred('light');
        }

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);

            if (delta > 0) {
                // Увеличиваем количество или добавляем новый товар
                if (existingItem) {
                    return prevItems.map(item =>
                        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                }
                return [...prevItems, { ...product, quantity: 1 }];
            } else {
                // Уменьшаем количество (delta < 0)
                if (existingItem && existingItem.quantity > 1) {
                    return prevItems.map(item =>
                        item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
                    );
                }
                // Если количество было 1, удаляем товар из массива полностью
                return prevItems.filter(item => item.id !== product.id);
            }
        });
    }, [mx]);

    const onSendData = useCallback(async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const payload = {
                items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
                queryId,
            };

            const response = await fetch('https://85.119.146.179:8000/web-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

            setCartItems([]); // Очищаем корзину после успеха
            if (mx?.showAlert) {
                mx.showAlert({ message: 'Заказ успешно оформлен!' });
            } else {
                alert('Заказ успешно оформлен!');
            }
            if (mx?.close) mx.close();

        } catch (error) {
            console.error('Ошибка при отправке заказа:', error);
            if (mx?.showAlert) {
                mx.showAlert({ message: 'Не удалось оформить заказ. Попробуйте позже.' });
            } else {
                alert('Не удалось оформить заказ.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [cartItems, isSubmitting, mx, queryId]);

    const total = getTotalPrice(cartItems);
    const isCartEmpty = cartItems.length === 0;

    return (
        <div className="list">
            {products.map(item => {
                // Находим товар в корзине, чтобы передать его текущее количество
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
                    <button 
                        className="custom-main-button"
                        onClick={onSendData}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Оформление...' : `Оформить заказ на ${total.toLocaleString('ru-RU')} ₽`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductList;