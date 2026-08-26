import React, { useState, useCallback, useEffect } from 'react';
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
    const [subject, setSubject] = useState('physical');
    const [phone, setPhone] = useState(''); // 🔥 Поле телефона
    
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [paymentProvider, setPaymentProvider] = useState('yookassa');
    const [orderNumber, setOrderNumber] = useState('');
    const [totalPaid, setTotalPaid] = useState(0);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableProviders, setAvailableProviders] = useState([]);
    
    const { mx, user } = useMax();
    const { request } = useApi();

    // 🔥 Проверка валидности формы (включая телефон)
    const isFormValid = 
        country.trim().length > 0 && 
        street.trim().length > 0 && 
        phone.trim().length >= 5;
    
    const total = getTotalPrice(cartItems);

    useEffect(() => {
        loadPaymentProviders();
    }, []);

    const loadPaymentProviders = async () => {
        try {
            const result = await request('/api/payment-providers');
            setAvailableProviders(result.providers || []);
            if (result.providers?.length > 0) setPaymentProvider(result.providers[0].id);
        } catch (error) {
            console.error('Ошибка загрузки платёжных систем:', error);
        }
    };

    const updateQuantity = useCallback((product, delta) => {
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('light');
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (delta > 0) {
                if (existingItem) return prevItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
                return [...prevItems, { ...product, quantity: 1 }];
            } else {
                if (existingItem && existingItem.quantity > 1) return prevItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item);
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

        try {
            const orderPayload = {
                phone: phone.trim(),
                items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
                delivery: { country: country.trim(), street: street.trim(), subject },
                payment: { method: paymentMethod, amount: total },
                userId: user?.id || null
            };

            const orderResult = await request('/api/orders', { 
                method: 'POST', 
                body: JSON.stringify(orderPayload) 
            });
            setOrderNumber(orderResult.orderNumber);
            setTotalPaid(orderResult.totalPrice);

            if (paymentMethod !== 'cash') {
                const paymentResult = await request('/api/payments/create', {
                    method: 'POST',
                    body: JSON.stringify({ 
                        orderNumber: orderResult.orderNumber, 
                        provider: paymentProvider, 
                        paymentMethod 
                    })
                });
                if (paymentResult.paymentUrl) {
                    setCartItems([]);
                    window.location.href = paymentResult.paymentUrl;
                    return;
                }
            }

            setCartItems([]);
            setStep('success');
            if (mx?.HapticFeedback) mx.HapticFeedback.notificationOccurred('success');
        } catch (error) {
            console.error('❌ Ошибка при оплате:', error);
            if (mx?.showAlert) mx.showAlert({ message: `Ошибка: ${error.message}` });
            else alert(`Ошибка: ${error.message}`);
            setStep('payment');
        } finally {
            setIsSubmitting(false);
        }
    }, [cartItems, country, street, subject, paymentMethod, paymentProvider, phone, total, isSubmitting, mx, user, setCartItems, request]);

    const handleClose = () => {
        if (mx?.close) mx.close();
        else if (onBack) onBack();
    };

    // Если корзина пуста
    if (cartItems.length === 0 && step !== 'success') {
        return (
            <div className="form-container">
                <p style={{ textAlign: 'center', padding: '40px 20px', color: '#636366' }}>
                    Корзина пуста.
                </p>
                {onBack && <button className="back-button" onClick={onBack}>← Вернуться</button>}
            </div>
        );
    }

    // ============================================
    // ЭКРАН УСПЕХА
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
                        <span className="order-detail-label">Телефон:</span>
                        <span className="order-detail-value">{phone}</span>
                    </div>
                    <div className="order-detail-row">
                        <span className="order-detail-label">Доставка:</span>
                        <span className="order-detail-value">{country}, {street}</span>
                    </div>
                </div>
                <div className="success-tips">
                    <div className="tip-item">
                        <span className="tip-icon">📞</span>
                        <span>Менеджер свяжется с вами</span>
                    </div>
                    <div className="tip-item">
                        <span className="tip-icon">👤</span>
                        <span>Заказ сохранён в личном кабинете</span>
                    </div>
                    <div className="tip-item">
                        <span className="tip-icon">🚚</span>
                        <span>Доставка в течение 3 дней</span>
                    </div>
                </div>
                <button className="submit-button" onClick={handleClose}>Закрыть</button>
            </div>
        );
    }

    // ============================================
    // ЭКРАН ОБРАБОТКИ
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
    // ЭКРАН ОПЛАТЫ
    // ============================================
    if (step === 'payment') {
        return (
            <div className="form-container">
                <button className="back-button" onClick={() => setStep('form')}>← Назад</button>
                <h2 className="form-title">Способ оплаты</h2>
                <div className="order-summary">
                    <h3>Ваш заказ:</h3>
                    {cartItems.map(item => (
                        <div key={item.id} className="order-item">
                            <div className="order-item-info">
                                <div className="order-item-title">{item.title}</div>
                                <div className="order-item-price">
                                    {item.price.toLocaleString('ru-RU')} ₽ × {item.quantity}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="order-total">
                        <strong>К оплате: {total.toLocaleString('ru-RU')} ₽</strong>
                    </div>
                </div>
                <div className="payment-methods">
                    <h3 className="payment-title">Выберите способ оплаты:</h3>
                    {availableProviders.map(provider => (
                        provider.methods.map(method => (
                            <label 
                                key={`${provider.id}-${method}`}
                                className={`payment-option ${paymentMethod === method && paymentProvider === provider.id ? 'active' : ''}`}
                            >
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    value={method}
                                    checked={paymentMethod === method && paymentProvider === provider.id}
                                    onChange={() => { 
                                        setPaymentMethod(method); 
                                        setPaymentProvider(provider.id); 
                                    }}
                                />
                                <span className="payment-icon">{provider.icon}</span>
                                <span className="payment-text">
                                    <strong>{provider.name}</strong>
                                    <small>
                                        {method === 'card' && 'Банковская карта'}
                                        {method === 'sbp' && 'Система быстрых платежей'}
                                        {method === 'sberpay' && 'Оплата через СберБанк Онлайн'}
                                        {method === 'yoomoney' && 'ЮMoney кошелёк'}
                                        {method === 'cash' && 'При получении'}
                                    </small>
                                </span>
                            </label>
                        ))
                    ))}
                </div>
                <button 
                    className="submit-button" 
                    onClick={handlePay} 
                    disabled={isSubmitting}
                >
                    {paymentMethod === 'cash' ? 'Подтвердить заказ' : `Оплатить ${total.toLocaleString('ru-RU')} ₽`}
                </button>
            </div>
        );
    }

    // ============================================
    // 🔥 ЭКРАН ФОРМЫ ДОСТАВКИ (С ПОЛЕМ ТЕЛЕФОНА!)
    // ============================================
    return (
        <div className="form-container">
            {onBack && <button className="back-button" onClick={onBack}>← Назад</button>}
            <h2 className="form-title">Данные для доставки</h2>
            
            <div className="form-group">
                <label className="form-label">Город *</label>
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
                <label className="form-label">Адрес *</label>
                <input 
                    className="form-input" 
                    type="text" 
                    placeholder="Например: ул. Ленина, д. 10, кв. 5" 
                    value={street} 
                    onChange={(e) => setStreet(e.target.value)}
                    disabled={isSubmitting}
                />
            </div>

            {/* 🔥 ПОЛЕ ТЕЛЕФОНА */}
            <div className="form-group">
                <label className="form-label">Телефон *</label>
                <input 
                    className="form-input" 
                    type="tel" 
                    placeholder="+7 (999) 123-45-67" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isSubmitting}
                />
                <p className="form-hint">
                    Для связи с вами и входа в личный кабинет
                </p>
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
            >
                Перейти к оплате →
            </button>
        </div>
    );
};

export default Form;