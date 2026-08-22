import React, { useState, useCallback } from 'react';
import './Form.css';
import { useMax } from '../../hooks/useMax';

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};

// Генерация случайного номера заказа
const generateOrderNumber = () => {
    return 'ORD-' + Math.floor(100000 + Math.random() * 900000);
};

const Form = ({ cartItems, setCartItems, onBack }) => {
    // 🔥 Состояние шагов: 'form' → 'payment' → 'processing' → 'success'
    const [step, setStep] = useState('form');
    
    // Данные доставки
    const [country, setCountry] = useState('');
    const [street, setStreet] = useState('');
    const [subject, setSubject] = useState('physical');
    
    // Данные оплаты
    const [paymentMethod, setPaymentMethod] = useState('card'); // card | sbp | cash
    const [orderNumber, setOrderNumber] = useState('');
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { mx, queryId } = useMax();

    const isFormValid = country.trim().length > 0 && street.trim().length > 0;
    const total = getTotalPrice(cartItems);

    // Изменение количества товара
    const updateQuantity = useCallback((product, delta) => {
        if (mx?.HapticFeedback) {
            mx.HapticFeedback.impactOccurred('light');
        }

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);

            if (delta > 0) {
                return prevItems.map(item =>
                    item.id === product.id 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                );
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

    // 🔥 Шаг 1 → Шаг 2: Переход к выбору оплаты
    const handleProceedToPayment = () => {
        if (!isFormValid) return;
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('medium');
        setStep('payment');
    };

    // 🔥 Шаг 2 → Шаг 3 → Шаг 4: Обработка оплаты
    const handlePay = useCallback(async () => {
        if (isSubmitting || cartItems.length === 0) return;

        setIsSubmitting(true);
        setStep('processing');

        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('heavy');

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
                payment: {
                    method: paymentMethod,
                    amount: total
                },
                queryId,
            };

            console.log('📤 Отправка заказа на сервер:', payload);

            // ============================================
            // ⚠️ ВНИМАНИЕ: Это ИМИТАЦИЯ оплаты для демо
            // В реальном проекте здесь должен быть запрос
            // к вашему серверу, который создаст платёж
            // через ЮKassa / Tinkoff / CloudPayments и т.д.
            // ============================================
            
            // Имитация задержки обработки платежа (2 секунды)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Имитация успешной оплаты (в реальности — ответ от сервера)
            const newOrderNumber = generateOrderNumber();
            setOrderNumber(newOrderNumber);

            console.log('✅ Оплата прошла успешно! Номер заказа:', newOrderNumber);

            // Очищаем корзину
            setCartItems([]);
            
            // Переходим к экрану успеха
            setStep('success');

            if (mx?.HapticFeedback) {
                mx.HapticFeedback.notificationOccurred('success');
            }

        } catch (error) {
            console.error('❌ Ошибка при оплате:', error);
            
            if (mx?.showAlert) {
                mx.showAlert({ message: `Не удалось провести оплату: ${error.message}` });
            } else {
                alert(`Не удалось провести оплату: ${error.message}`);
            }
            
            // Возвращаемся к выбору оплаты
            setStep('payment');
        } finally {
            setIsSubmitting(false);
        }
    }, [cartItems, country, street, subject, paymentMethod, total, isSubmitting, mx, queryId, setCartItems]);

    // 🔥 Закрытие приложения после успеха
    const handleClose = () => {
        if (mx?.close) {
            mx.close();
        } else {
            alert('Спасибо за покупку! Приложение будет закрыто.');
        }
    };

    // Если корзина пуста
    if (cartItems.length === 0 && step !== 'success') {
        return (
            <div className="form-container">
                <p style={{ textAlign: 'center', padding: '40px 20px', color: '#636366' }}>
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

    // ============================================
    // ЭКРАН 4: УСПЕШНАЯ ОПЛАТА
    // ============================================
    if (step === 'success') {
        return (
            <div className="form-container success-screen">
                <div className="success-icon">✓</div>
                <h2 className="success-title">Заказ оплачен!</h2>
                <p className="success-subtitle">Спасибо за покупку 🎉</p>
                
                <div className="order-details-card">
                    <div className="order-detail-row">
                        <span className="order-detail-label">Номер заказа:</span>
                        <span className="order-detail-value">{orderNumber}</span>
                    </div>
                    <div className="order-detail-row">
                        <span className="order-detail-label">Сумма:</span>
                        <span className="order-detail-value">{total.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div className="order-detail-row">
                        <span className="order-detail-label">Способ оплаты:</span>
                        <span className="order-detail-value">
                            {paymentMethod === 'card' && '💳 Банковская карта'}
                            {paymentMethod === 'sbp' && '⚡ СБП'}
                            {paymentMethod === 'cash' && '💵 При получении'}
                        </span>
                    </div>
                    <div className="order-detail-row">
                        <span className="order-detail-label">Доставка:</span>
                        <span className="order-detail-value">{country}, {street}</span>
                    </div>
                </div>

                <p className="success-note">
                    Мы отправили подтверждение в чат с ботом. Менеджер свяжется с вами в ближайшее время.
                </p>

                <button className="submit-button" onClick={handleClose}>
                    Закрыть
                </button>
            </div>
        );
    }

    // ============================================
    // ЭКРАН 3: ОБРАБОТКА ПЛАТЕЖА
    // ============================================
    if (step === 'processing') {
        return (
            <div className="form-container processing-screen">
                <div className="processing-spinner"></div>
                <h2 className="processing-title">Обработка платежа...</h2>
                <p className="processing-subtitle">
                    Пожалуйста, не закрывайте приложение
                </p>
            </div>
        );
    }

    // ============================================
    // ЭКРАН 2: ВЫБОР СПОСОБА ОПЛАТЫ
    // ============================================
    if (step === 'payment') {
        return (
            <div className="form-container">
                <button className="back-button" onClick={() => setStep('form')} type="button">
                    ← Назад к доставке
                </button>

                <h2 className="form-title">Способ оплаты</h2>

                {/* Сводка заказа */}
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
                            <div className="quantity-control">
                                <button 
                                    className="qty-btn" 
                                    onClick={() => updateQuantity(item, -1)}
                                    disabled={isSubmitting}
                                >
                                    −
                                </button>
                                <span className="qty-value">{item.quantity}</span>
                                <button 
                                    className="qty-btn" 
                                    onClick={() => updateQuantity(item, 1)}
                                    disabled={isSubmitting}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="order-total">
                        <strong>К оплате: {total.toLocaleString('ru-RU')} ₽</strong>
                    </div>
                </div>

                {/* Выбор способа оплаты */}
                <div className="payment-methods">
                    <h3 className="payment-title">Выберите способ оплаты:</h3>
                    
                    <label className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                        <input 
                            type="radio" 
                            name="payment" 
                            value="card"
                            checked={paymentMethod === 'card'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span className="payment-icon">💳</span>
                        <span className="payment-text">
                            <strong>Банковская карта</strong>
                            <small>Visa, Mastercard, МИР</small>
                        </span>
                    </label>

                    <label className={`payment-option ${paymentMethod === 'sbp' ? 'active' : ''}`}>
                        <input 
                            type="radio" 
                            name="payment" 
                            value="sbp"
                            checked={paymentMethod === 'sbp'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span className="payment-icon">⚡</span>
                        <span className="payment-text">
                            <strong>СБП</strong>
                            <small>Система быстрых платежей</small>
                        </span>
                    </label>

                    <label className={`payment-option ${paymentMethod === 'cash' ? 'active' : ''}`}>
                        <input 
                            type="radio" 
                            name="payment" 
                            value="cash"
                            checked={paymentMethod === 'cash'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span className="payment-icon">💵</span>
                        <span className="payment-text">
                            <strong>При получении</strong>
                            <small>Наличными или картой курьеру</small>
                        </span>
                    </label>
                </div>

                <button
                    className="submit-button"
                    onClick={handlePay}
                    disabled={isSubmitting || cartItems.length === 0}
                    type="button"
                >
                    Оплатить {total.toLocaleString('ru-RU')} ₽
                </button>
            </div>
        );
    }

    // ============================================
    // ЭКРАН 1: ФОРМА ДОСТАВКИ
    // ============================================
    return (
        <div className="form-container">
            {onBack && (
                <button className="back-button" onClick={onBack} type="button">
                    ← Назад к товарам
                </button>
            )}

            <h2 className="form-title">Данные для доставки</h2>
            
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
                onClick={handleProceedToPayment}
                disabled={!isFormValid}
                type="button"
            >
                Перейти к оплате →
            </button>
        </div>
    );
};

export default Form;