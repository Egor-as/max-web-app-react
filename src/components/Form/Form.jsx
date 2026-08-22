import React, { useState, useCallback } from 'react';
import './Form.css';
import { useMax } from '../../hooks/useMax';

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};

const Form = ({ cartItems, setCartItems, onBack }) => {
    const [country, setCountry] = useState('');
    const [street, setStreet] = useState('');
    const [subject, setSubject] = useState('physical');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { mx, queryId } = useMax();

    const isFormValid = country.trim().length > 0 && street.trim().length > 0;
    const total = getTotalPrice(cartItems);

    // 🔥 Функция изменения количества товара прямо в форме
    const updateQuantity = useCallback((product, delta) => {
        if (mx?.HapticFeedback) {
            mx.HapticFeedback.impactOccurred('light');
        }

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);

            if (delta > 0) {
                // Увеличиваем количество
                return prevItems.map(item =>
                    item.id === product.id 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                );
            } else {
                // Уменьшаем количество
                if (existingItem && existingItem.quantity > 1) {
                    return prevItems.map(item =>
                        item.id === product.id 
                            ? { ...item, quantity: item.quantity - 1 } 
                            : item
                    );
                }
                // Если количество было 1 — удаляем товар
                return prevItems.filter(item => item.id !== product.id);
            }
        });
    }, [mx, setCartItems]);

    const onSendData = useCallback(async () => {
        if (!isFormValid || isSubmitting || cartItems.length === 0) return;

        setIsSubmitting(true);

        if (mx?.HapticFeedback) {
            mx.HapticFeedback.impactOccurred('medium');
        }

        try {
            const payload = {
                items: cartItems.map(item => ({ 
                    id: item.id, 
                    quantity: item.quantity 
                })),
                delivery: {
                    country: country.trim(),
                    street: street.trim(),
                    subject: subject
                },
                queryId,
            };

            console.log('📤 Отправка заказа:', payload);

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
            
            if (mx?.close) {
                mx.close();
            }

        } catch (error) {
            console.error('❌ Ошибка при отправке заказа:', error);
            
            if (mx?.showAlert) {
                mx.showAlert({ message: `Не удалось оформить заказ: ${error.message}` });
            } else {
                alert(`Не удалось оформить заказ: ${error.message}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [cartItems, country, street, subject, isFormValid, isSubmitting, mx, queryId, setCartItems]);

    // Если корзина пуста, возвращаем пользователя к товарам
    if (cartItems.length === 0) {
        return (
            <div className="form-container">
                <p style={{ textAlign: 'center', padding: '40px 20px' }}>
                    Корзина пуста. Добавьте товары для оформления заказа.
                </p>
                {onBack && (
                    <button className="back-button" onClick={onBack}>
                        ← Вернуться к товарам
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="form-container">
            {onBack && (
                <button className="back-button" onClick={onBack} type="button">
                    ← Назад к товарам
                </button>
            )}

            <h2 className="form-title">Оформление заказа</h2>
            
            {/* 🔥 Сводка заказа с возможностью изменения количества */}
            <div className="order-summary">
                <h3>Ваш заказ:</h3>
                {cartItems.map(item => (
                    <div key={item.id} className="order-item">
                        <div className="order-item-info">
                            <div className="order-item-title">{item.title}</div>
                            <div className="order-item-price">
                                {item.price.toLocaleString('ru-RU')} ₽ × {item.quantity} = 
                                <strong> {(item.price * item.quantity).toLocaleString('ru-RU')} ₽</strong>
                            </div>
                        </div>
                        
                        {/* Счетчик количества */}
                        <div className="quantity-control">
                            <button 
                                className="qty-btn" 
                                onClick={() => updateQuantity(item, -1)}
                                disabled={isSubmitting}
                                aria-label="Уменьшить количество"
                            >
                                −
                            </button>
                            <span className="qty-value">{item.quantity}</span>
                            <button 
                                className="qty-btn" 
                                onClick={() => updateQuantity(item, 1)}
                                disabled={isSubmitting}
                                aria-label="Увеличить количество"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
                <div className="order-total">
                    <strong>Итого: {total.toLocaleString('ru-RU')} ₽</strong>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Страна / Город</label>
                <input
                    className="form-input"
                    type="text"
                    placeholder="Например: Москва"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    disabled={isSubmitting}
                />
            </div>
            
            <div className="form-group">
                <label className="form-label">Улица, дом, квартира</label>
                <input
                    className="form-input"
                    type="text"
                    placeholder="Например: ул. Ленина, д. 10, кв. 5"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    disabled={isSubmitting}
                />
            </div>
            
            <div className="form-group">
                <label className="form-label">Тип покупателя</label>
                <select 
                    className="form-select"
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    disabled={isSubmitting}
                >
                    <option value="physical">Физическое лицо</option>
                    <option value="legal">Юридическое лицо</option>
                </select>
            </div>

            <button
                className="submit-button"
                onClick={onSendData}
                disabled={!isFormValid || isSubmitting || cartItems.length === 0}
                type="button"
            >
                {isSubmitting ? 'Отправка...' : `Подтвердить заказ на ${total.toLocaleString('ru-RU')} ₽`}
            </button>
        </div>
    );
};

export default Form;