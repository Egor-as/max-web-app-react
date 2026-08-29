import React, { useState, useCallback } from 'react';
import './Form.css';
import { useMax } from '../../hooks/useMax';
import { useApi } from '../../hooks/useApi';

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};

const Form = ({ cartItems, setCartItems, onBack }) => {
    const [step, setStep] = useState('form');
    
    const [country, setCountry] = useState('');
    const [street, setStreet] = useState('');
    const [phone, setPhone] = useState('');
    const [inn, setInn] = useState('');
    
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [orderNumber, setOrderNumber] = useState('');
    const [totalPaid, setTotalPaid] = useState(0);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { mx, user } = useMax();
    const { request } = useApi();

    const isFormValid = 
        country.trim().length > 0 && 
        street.trim().length > 0 && 
        phone.trim().length >= 5 &&
        (inn.trim().length === 10 || inn.trim().length === 12);
    
    const total = getTotalPrice(cartItems);

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

    const handleProceedToPayment = () => {
        if (!isFormValid) {
            alert('Пожалуйста, заполните все обязательные поля (Город, Адрес, Телефон, ИНН)');
            return;
        }
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('medium');
        setStep('payment');
    };

    const handlePay = useCallback(async () => {
        if (isSubmitting || cartItems.length === 0) return;
        setIsSubmitting(true);
        setStep('processing');
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('heavy');

        try {
            const orderPayload = {
                phone: phone.trim(),
                inn: inn.trim(),
                items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
                delivery: { country: country.trim(), street: street.trim() },
                payment: { method: paymentMethod, amount: total },
                userId: user?.id || null
            };

            console.log('📤 [Form] Отправка заказа на бэкенд:', orderPayload);

            const orderResult = await request('/api/orders', { 
                method: 'POST', 
                body: JSON.stringify(orderPayload) 
            });
            
            console.log('📥 [Form] Ответ от бэкенда:', orderResult);
            
            setOrderNumber(orderResult.orderNumber);
            setTotalPaid(orderResult.totalPrice);

            if (paymentMethod !== 'cash' && orderResult.paymentUrl) {
                setCartItems([]);
                window.location.href = orderResult.paymentUrl;
                return;
            }

            setCartItems([]);
            setStep('success');
            if (mx?.HapticFeedback) mx.HapticFeedback.notificationOccurred('success');
        } catch (error) {
            console.error('❌ [Form] Ошибка при оформлении заказа:', error);
            alert(`Ошибка: ${error.message || 'Не удалось создать заказ'}`);
            setStep('payment');
        } finally {
            setIsSubmitting(false);
        }
    }, [cartItems, country, street, inn, paymentMethod, phone, total, isSubmitting, mx, user, setCartItems, request]);

    const handleClose = () => {
        if (mx?.close) mx.close();
        else if (onBack) onBack();
    };

    if (cartItems.length === 0 && step !== 'success') {
        return (
            <div className="form-container">
                <p style={{ textAlign: 'center', padding: '40px 20px', color: '#636366' }}>Корзина пуста.</p>
                {onBack && <button className="back-button" onClick={onBack}>← Вернуться</button>}
            </div>
        );
    }

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
                        <span className="order-detail-label">Телефон:</span>
                        <span className="order-detail-value">{phone}</span>
                    </div>
                </div>
                <button className="submit-button" onClick={handleClose}>Закрыть</button>
            </div>
        );
    }

    if (step === 'processing') {
        return (
            <div className="form-container processing-screen">
                <div className="processing-spinner"></div>
                <h2 className="processing-title">Обработка заказа...</h2>
                <p className="processing-subtitle">Пожалуйста, не закрывайте приложение</p>
            </div>
        );
    }

    if (step === 'payment') {
        return (
            <div className="form-container">
                <button className="back-button" onClick={() => setStep('form')}>← Назад</button>
                <h2 className="form-title">Оформление заказа</h2>
                
                <div className="order-summary">
                    <h3>Ваш заказ:</h3>
                    {cartItems.map(item => (
                        <div key={item.id} className="order-item">
                            <div className="order-item-info">
                                <div className="order-item-title">{item.title}</div>
                                <div className="order-item-price">
                                    {item.price.toLocaleString('ru-RU')} ₽ × {item.quantity} = {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                                </div>
                            </div>
                            <div className="quantity-controls">
                                <button 
                                    className="quantity-btn"
                                    onClick={() => updateQuantity(item, -1)}
                                    disabled={isSubmitting}
                                >
                                    −
                                </button>
                                <span className="quantity-value">{item.quantity}</span>
                                <button 
                                    className="quantity-btn"
                                    onClick={() => updateQuantity(item, 1)}
                                    disabled={isSubmitting}
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
                
                <div className="payment-methods">
                    <h3 className="payment-title">Выберите способ оплаты:</h3>
                    
                    <label className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                        <input 
                            type="radio" 
                            name="payment" 
                            value="card"
                            checked={paymentMethod === 'card'}
                            onChange={() => setPaymentMethod('card')}
                        />
                        <div className="payment-icon-wrapper">
                            <span className="payment-icon-large"></span>
                        </div>
                        <span className="payment-option-text">Банковская карта</span>
                    </label>
                    
                    <label className={`payment-option ${paymentMethod === 'sbp' ? 'active' : ''}`}>
                        <input 
                            type="radio" 
                            name="payment" 
                            value="sbp"
                            checked={paymentMethod === 'sbp'}
                            onChange={() => setPaymentMethod('sbp')}
                        />
                        <div className="payment-icon-wrapper">
                            <span className="payment-icon-large">⚡</span>
                        </div>
                        <span className="payment-option-text">СБП</span>
                    </label>
                    
                    <label className={`payment-option ${paymentMethod === 'cash' ? 'active' : ''}`}>
                        <input 
                            type="radio" 
                            name="payment" 
                            value="cash"
                            checked={paymentMethod === 'cash'}
                            onChange={() => setPaymentMethod('cash')}
                        />
                        <div className="payment-icon-wrapper">
                            <span className="payment-icon-large">💵</span>
                        </div>
                        <span className="payment-option-text">При получении (Наличными курьеру)</span>
                    </label>
                </div>
                
                <button 
                    className="submit-button" 
                    onClick={handlePay} 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Обработка...' : (paymentMethod === 'cash' ? 'Подтвердить заказ' : `Оплатить ${total.toLocaleString('ru-RU')} ₽`)}
                </button>
            </div>
        );
    }

    return (
        <div className="form-container">
            {onBack && <button className="back-button" onClick={onBack}>← Назад</button>}
            <h2 className="form-title">Данные для доставки</h2>
            
            <div className="form-group">
                <label className="form-label">Город *</label>
                <input className="form-input" type="text" placeholder="Например: Москва" value={country} onChange={(e) => setCountry(e.target.value)} disabled={isSubmitting} />
            </div>
            
            <div className="form-group">
                <label className="form-label">Адрес *</label>
                <input className="form-input" type="text" placeholder="Например: ул. Ленина, д. 10" value={street} onChange={(e) => setStreet(e.target.value)} disabled={isSubmitting} />
            </div>

            <div className="form-group">
                <label className="form-label">Телефон *</label>
                <input className="form-input" type="tel" placeholder="+7 (999) 123-45-67" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isSubmitting} />
                <p className="form-hint">Для связи с вами</p>
            </div>

            <div className="form-group">
                <label className="form-label">ИНН *</label>
                <input 
                    className="form-input" 
                    type="text" 
                    placeholder="10 или 12 цифр" 
                    value={inn} 
                    onChange={(e) => setInn(e.target.value.replace(/\D/g, '').slice(0, 12))} 
                    disabled={isSubmitting} 
                />
                <p className="form-hint">ИНН организации (10 или 12 цифр)</p>
            </div>

            <button className="submit-button" onClick={handleProceedToPayment} disabled={!isFormValid || isSubmitting}>
                Перейти к оплате →
            </button>
        </div>
    );
};

export default Form;