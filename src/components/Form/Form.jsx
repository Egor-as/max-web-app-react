import React, { useState, useCallback } from 'react';
import './Form.css';
import { useMax } from '../../hooks/useMax';

// ==========================================
// 🔥 НАСТРОЙКА АДРЕСА СЕРВЕРА
// ==========================================
// Вариант 1: ИМИТАЦИЯ (работает без сервера, для тестов)
const USE_MOCK = true;

// Вариант 2: Реальный сервер (когда будет готов)
// const USE_MOCK = false;
// const API_URL = 'http://localhost:8000/web-data';
// const API_URL = 'http://192.168.1.5:8000/web-data';  // для телефона в той же Wi-Fi сети
// const API_URL = 'https://ваш-адрес.ngrok-free.app/web-data';  // через ngrok
// ==========================================

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};

const Form = ({ cartItems, setCartItems, onBack }) => {
    const [step, setStep] = useState('form');
    
    const [country, setCountry] = useState('');
    const [street, setStreet] = useState('');
    const [subject, setSubject] = useState('physical');
    
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [orderNumber, setOrderNumber] = useState('');
    const [totalPaid, setTotalPaid] = useState(0);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { mx, queryId, user } = useMax();

    const isFormValid = country.trim().length > 0 && street.trim().length > 0;
    const total = getTotalPrice(cartItems);

    const updateQuantity = useCallback((product, delta) => {
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('light');

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);

            if (delta > 0) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                if (existingItem && existingItem.quantity > 1) {
                    return prevItems.map(item =>
                        item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
                    );
                }
                return prevItems.filter(item => item.id !== product.id);
            }
        });
    }, [mx, setCartItems]);

    const handleProceedToPayment = () => {
        if (!isFormValid) return;
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('medium');
        setStep('payment');
    };

    const handlePay = useCallback(async () => {
        if (isSubmitting || cartItems.length === 0) return;

        setIsSubmitting(true);
        setStep('processing');

        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('heavy');

        const payload = {
            items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
            delivery: { country: country.trim(), street: street.trim(), subject: subject },
            payment: { method: paymentMethod, amount: total },
            queryId,
            userId: user?.id || null,
        };

        console.log('📦 Отправка заказа:', payload);

        try {
            let result;

            if (USE_MOCK) {
                // 🔥 ИМИТАЦИЯ: ждём 2 секунды и генерируем номер заказа
                await new Promise(resolve => setTimeout(resolve, 2000));
                result = {
                    status: 'success',
                    orderNumber: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
                    totalPrice: total
                };
                console.log('✅ [ИМИТАЦИЯ] Заказ оформлен:', result);
            } else {
                // 🔥 РЕАЛЬНЫЙ ЗАПРОС К СЕРВЕРУ
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || `Ошибка сервера: ${response.status}`);
                }

                result = await response.json();
                console.log('✅ Заказ успешно оформлен!', result);
            }

            setOrderNumber(result.orderNumber || 'ORD-UNKNOWN');
            setTotalPaid(result.totalPrice || total);
            setCartItems([]);
            setStep('success');

            if (mx?.HapticFeedback) {
                mx.HapticFeedback.notificationOccurred('success');
            }
        } catch (error) {
            console.error('❌ Ошибка при оплате:', error);
            
            const errorMsg = error.message.includes('Failed to fetch') 
                ? 'Не удалось соединиться с сервером. Проверьте подключение.' 
                : `Ошибка: ${error.message}`;

            if (mx?.showAlert) {
                mx.showAlert({ message: errorMsg });
            } else {
                alert(errorMsg);
            }
            setStep('payment');
        } finally {
            setIsSubmitting(false);
        }
    }, [cartItems, country, street, subject, paymentMethod, total, isSubmitting, mx, queryId, user, setCartItems]);

    const handleClose = () => {
        if (mx?.close) {
            mx.close();
        } else {
            alert('Спасибо за покупку! Приложение будет закрыто.');
        }
    };

    // Если корзина пуста (не на экране успеха)
    if (cartItems.length === 0 && step !== 'success') {
        return (
            <div className="form-container">
                <p style={{ textAlign: 'center', padding: '40px 20px', color: '#636366' }}>
                    Корзина пуста. Добавьте товары для оформления заказа.
                </p>
                {onBack && (
                    <button className="back-button" onClick={onBack}>← Вернуться к товарам</button>
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
                <h2 className="success-title">Заказ оформлен!</h2>
                <p className="success-subtitle">Спасибо за покупку 🎉</p>
                
                <div className="order-details-card">
                    <div className="order-detail-row">
                        <span className="order-detail-label">Номер заказа:</span>
                        <span className="order-detail-value order-number">{orderNumber}</span>
                    </div>
                    <div className="order-detail-row">
                        <span className="order-detail-label">Сумма:</span>
                        <span className="order-detail-value price-value">{totalPaid.toLocaleString('ru-RU')} ₽</span>
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

                <div className="success-tips">
                    <div className="tip-item">
                        <span className="tip-icon">📧</span>
                        <span>Подтверждение отправлено</span>
                    </div>
                    <div className="tip-item">
                        <span className="tip-icon">📞</span>
                        <span>Менеджер свяжется с вами</span>
                    </div>
                    <div className="tip-item">
                        <span className="tip-icon">🚚</span>
                        <span>Доставка в течение 3 дней</span>
                    </div>
                </div>

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
                <h2 className="processing-title">Обработка заказа...</h2>
                <p className="processing-subtitle">Пожалуйста, не закрывайте приложение</p>
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
                                <button className="qty-btn" onClick={() => updateQuantity(item, -1)} disabled={isSubmitting}>−</button>
                                <span className="qty-value">{item.quantity}</span>
                                <button className="qty-btn" onClick={() => updateQuantity(item, 1)} disabled={isSubmitting}>+</button>
                            </div>
                        </div>
                    ))}
                    <div className="order-total">
                        <strong>К оплате: {total.toLocaleString('ru-RU')} ₽</strong>
                    </div>
                </div>

                <div className="payment-methods">
                    <h3 className="payment-title">Выберите способ оплаты:</h3>
                    
                    <label className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                        <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} />
                        <span className="payment-icon">💳</span>
                        <span className="payment-text"><strong>Банковская карта</strong><small>Visa, Mastercard, МИР</small></span>
                    </label>

                    <label className={`payment-option ${paymentMethod === 'sbp' ? 'active' : ''}`}>
                        <input type="radio" name="payment" value="sbp" checked={paymentMethod === 'sbp'} onChange={(e) => setPaymentMethod(e.target.value)} />
                        <span className="payment-icon">⚡</span>
                        <span className="payment-text"><strong>СБП</strong><small>Система быстрых платежей</small></span>
                    </label>

                    <label className={`payment-option ${paymentMethod === 'cash' ? 'active' : ''}`}>
                        <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={(e) => setPaymentMethod(e.target.value)} />
                        <span className="payment-icon">💵</span>
                        <span className="payment-text"><strong>При получении</strong><small>Наличными или картой курьеру</small></span>
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
    // ЭКРАН 1: ФОРМА ДОСТАВКИ (дефолтный)
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