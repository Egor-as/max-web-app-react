import React, { useState, useCallback, useEffect } from 'react';
import './ProductList.css';
import ProductItem from '../ProductItem/ProductItem';
import { useMax } from '../../hooks/useMax';

// Добавил поле image, чтобы компонент ProductItem отображал картинки корректно
const products = [
    { id: '1', title: 'Джинсы', price: 5000, description: 'Синего цвета, прямые', image: '/images/jeans.jpg' },
    { id: '2', title: 'Куртка', price: 12000, description: 'Зеленого цвета, теплая', image: '/images/jacket.jpg' },
    // ... остальные товары
];

// Исправленный и безопасный расчет суммы (только для отображения на UI!)
const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};

const ProductList = () => {
    // Храним в корзине объект с количеством: { ...product, quantity: 1 }
    const [cartItems, setCartItems] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { mx, queryId } = useMax();

    // Формируем безопасный payload только с ID и количеством
    const getSafePayload = () => {
        return cartItems.map(item => ({
            id: item.id,
            quantity: item.quantity
        }));
    };

    const onSendData = useCallback(async () => {
        if (!mx || isSubmitting) return;

        setIsSubmitting(true);
        // Показываем прогресс на главной кнопке (если поддерживается)
        if (mx.MainButton.showProgress) mx.MainButton.showProgress();

        try {
            const payload = {
                items: getSafePayload(), // БЕЗОПАСНО: только ID и количество
                queryId,
                // totalPrice можно отправить для справки, но бэкенд должен пересчитать его сам!
                frontendTotalPrice: getTotalPrice(cartItems) 
            };

            // ВНИМАНИЕ: Замени http на https! Лучше использовать переменную окружения.
            const response = await fetch('https://85.119.146.179:8000/web-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }

            // Успех! Очищаем корзину и закрываем приложение (или показываем успех)
            setCartItems([]);
            if (mx.showAlert) {
                mx.showAlert({ message: 'Заказ успешно оформлен!' });
            }
            mx.close();

        } catch (error) {
            console.error('Ошибка при отправке заказа:', error);
            if (mx.showAlert) {
                mx.showAlert({ message: 'Не удалось оформить заказ. Попробуйте позже.' });
            }
        } finally {
            setIsSubmitting(false);
            if (mx.MainButton.hideProgress) mx.MainButton.hideProgress();
        }
    }, [cartItems, isSubmitting, mx, queryId]);

    // Управление главной кнопкой
    useEffect(() => {
        if (!mx?.MainButton) return;

        const total = getTotalPrice(cartItems);

        if (cartItems.length === 0) {
            mx.MainButton.hide();
            mx.MainButton.offClick(onSendData);
        } else {
            mx.MainButton.setParams({
                text: `Оформить заказ на ${total.toLocaleString('ru-RU')} ₽`,
                is_active: !isSubmitting,
                is_visible: true
            });
            mx.MainButton.onClick(onSendData);
        }

        return () => {
            if (mx?.MainButton) {
                mx.MainButton.offClick(onSendData);
            }
        };
    }, [cartItems, isSubmitting, mx, onSendData]);

    // Логика добавления в корзину с учетом количества
    const onAdd = (product) => {
        if (!mx) return;

        // Виброотклик при добавлении (значительно улучшает UX!)
        if (mx.HapticFeedback) {
            mx.HapticFeedback.impactOccurred('light');
        }

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            
            if (existingItem) {
                // Если товар уже есть, увеличиваем количество
                return prevItems.map(item => 
                    item.id === product.id 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                );
            } else {
                // Если товара нет, добавляем его с количеством 1
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };

    return (
        <div className="list">
            {products.map(item => (
                <ProductItem
                    key={item.id} // Всегда добавляй key при маппинге списков!
                    product={item}
                    onAdd={onAdd}
                    className="item"
                />
            ))}
        </div>
    );
};

export default ProductList;