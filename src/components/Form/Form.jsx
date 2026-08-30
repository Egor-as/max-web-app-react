import React, { useState } from 'react';
import './Form.css';
import { useMax } from '../../hooks/useMax';
import { useApi } from '../../hooks/useApi';
import { useDadata } from '../../hooks/useDadata';
import { useFeatures } from '../../hooks/useFeatures';

const Form = ({ cartItems, setCartItems, onBack }) => {
    const { mx } = useMax();
    const { request } = useApi();
    const features = useFeatures();

    const [step, setStep] = useState('delivery');

    const [delivery, setDelivery] = useState({
        country: '',
        street: '',
        phone: '',
        inn: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [error, setError] = useState('');
    const [orderSuccess, setOrderSuccess] = useState(null);

    // 🔥 Состояния для промокода
    const [promoCode, setPromoCode] = useState('');
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [promoError, setPromoError] = useState('');
    const [isCheckingPromo, setIsCheckingPromo] = useState(false);
    const [appliedPromo, setAppliedPromo] = useState(null);

    const { suggestions: citySuggestions, isEnabled: isDadataEnabled } = useDadata(delivery.country);
    const { suggestions: addressSuggestions } = useDadata(delivery.street);

    const isDevMode = process.env.REACT_APP_DEV_MODE === 'true';
    const isValidInn = (inn) => /^\d{10}$|^\d{12}$/.test(inn);

    const isDeliveryValid =
        delivery.country.trim().length > 0 &&
        delivery.street.trim().length > 0 &&
        delivery.phone.trim().length >= 10 &&
        isValidInn(delivery.inn);

    // 🔥 Подсчёт суммы с учётом скидки
    const originalTotalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalPrice = Math.max(0, originalTotalPrice - promoDiscount);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const updateQuantity = (product, delta) => {
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('light');
        setCartItems(prevItems => {
            if (delta > 0) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                if (product.quantity > 1) {
                    return prevItems.map(item =>
                        item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
                    );
                }
                return prevItems.filter(item => item.id !== product.id);
            }
        });
    };

    const removeItem = (productId) => {
        if (mx?.HapticFeedback) mx.HapticFeedback.notificationOccurred('warning');
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    // 🔥 Проверка промокода
    const handleCheckPromo = async () => {
        if (!promoCode.trim()) {
            setPromoError('Введите промокод');
            return;
        }

        setIsCheckingPromo(true);
        setPromoError('');

        try {
            const result = await request('/api/promo/validate', {
                method: 'POST',
                body: JSON.stringify({
                    code: promoCode.trim(),
                    orderTotal: originalTotalPrice,
                    phone: delivery.phone
                })
            });

            if (result.valid) {
                setPromoDiscount(result.discountAmount);
                setAppliedPromo(result);
                setPromoError('');
                if (mx?.HapticFeedback) mx.HapticFeedback.notificationOccurred('success');
            } else {
                setPromoError(result.error || 'Промокод недействителен');
                setPromoDiscount(0);
                setAppliedPromo(null);
                if (mx?.HapticFeedback) mx.HapticFeedback.notificationOccurred('error');
            }
        } catch (error) {
            console.error('Ошибка проверки промокода:', error);
            setPromoError('Ошибка проверки промокода');
            setPromoDiscount(0);
        } finally {
            setIsCheckingPromo(false);
        }
    };

    const handleRemovePromo = () => {
        setPromoCode('');
        setPromoDiscount(0);
        setAppliedPromo(null);
        setPromoError('');
    };

    const handleDeliveryConfirm = () => {
        if (!isDeliveryValid) {
            setError('Заполните все поля корректно. ИНН должен содержать 10 или 12 цифр.');
            if (mx?.HapticFeedback) mx.HapticFeedback.notificationOccurred('error');
            return;
        }
        setError('');
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('medium');
        setStep('checkout');
    };

    const handleOrderSubmit = async () => {
        if (cartItems.length === 0) {
            setError('Корзина пуста');
            return;
        }

        if (isDevMode) {
            setStep('processing');
            if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('heavy');

            setTimeout(() => {
                const fakeOrder = {
                    orderNumber: `ORD-DEV-${Date.now().toString(36).toUpperCase()}`,
                    totalPrice: totalPrice,
                    discountAmount: promoDiscount
                };
                setOrderSuccess(fakeOrder);
                setStep('success');
                setCartItems([]);
                if (mx?.HapticFeedback) mx.HapticFeedback.notificationOccurred('success');
            }, 2500);
        } else {
            setStep('processing');
            try {
                const orderData = {
                    items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
                    delivery: {
                        country: delivery.country,
                        street: delivery.street
                    },
                    phone: delivery.phone,
                    inn: delivery.inn,
                    payment: { method: paymentMethod },
                    promoCode: appliedPromo?.code || null
                };

                const result = await request('/api/orders', {
                    method: 'POST',
                    body: JSON.stringify(orderData)
                });

                setOrderSuccess(result);
                setStep('success');
                setCartItems([]);
                if (mx?.HapticFeedback) mx.HapticFeedback.notificationOccurred('success');
            } catch (err) {
                console.error('Ошибка оформления заказа:', err);
                setError('Не удалось оформить заказ. Попробуйте позже.');
                setStep('checkout');
                if (mx?.HapticFeedback) mx.HapticFeedback.notificationOccurred('error');
            }
        }
    };

    // ==========================================
    // ЭКРАН УСПЕХА
    // ==========================================
    if (step === 'success' && orderSuccess) {
        return (
            <div className="form-container success-container">
                <div className="success-animation">
                    <div className="success-circle">
                        <svg className="success-checkmark" viewBox="0 0 52 52">
                            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                        </svg>
                    </div>
                </div>
                <h2 className="success-title">Заказ оформлен!</h2>
                <p className="success-order-number">
                    № <strong>{orderSuccess.orderNumber}</strong>
                </p>
                <p className="success-total">
                    Сумма: <strong>{orderSuccess.totalPrice.toLocaleString('ru-RU')} ₽</strong>
                </p>
                {orderSuccess.discountAmount > 0 && (
                    <p className="success-discount">
                        💰 Ваша скидка: <strong>{orderSuccess.discountAmount.toLocaleString('ru-RU')} ₽</strong>
                    </p>
                )}
                <p className="success-hint">
                    {isDevMode ? '🧪 Это тестовый заказ (режим разработчика)' : 'Мы свяжемся с вами для подтверждения'}
                </p>
                <button className="action-btn primary" onClick={() => window.location.reload()}>
                    В главное меню
                </button>
            </div>
        );
    }

    // ==========================================
    // АНИМАЦИЯ ОБРАБОТКИ
    // ==========================================
    if (step === 'processing') {
        return (
            <div className="form-container processing-container">
                <div className="processing-animation">
                    <div className="processing-spinner"></div>
                    <div className="processing-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>
                <h2 className="processing-title">Обработка заказа</h2>
                <p className="processing-text">
                    {isDevMode ? 'Имитация оплаты...' : 'Подключение к платёжной системе...'}
                </p>
                <p className="processing-hint">Пожалуйста, подождите</p>
            </div>
        );
    }

    // ==========================================
    // ШАГ 2: ОФОРМЛЕНИЕ ЗАКАЗА (с промокодом)
    // ==========================================
    if (step === 'checkout') {
        return (
            <div className="form-container">
                <button className="back-button" onClick={() => setStep('delivery')}>
                    ← Назад к доставке
                </button>

                <h2 className="form-title">Оформление заказа</h2>

                {/* Адрес доставки (только для просмотра) */}
                <div className="delivery-summary">
                    <h3 className="section-title"> Адрес доставки</h3>
                    <div className="delivery-info">
                        <div className="delivery-row">
                            <span className="delivery-label">Город:</span>
                            <span className="delivery-value">{delivery.country}</span>
                        </div>
                        <div className="delivery-row">
                            <span className="delivery-label">Адрес:</span>
                            <span className="delivery-value">{delivery.street}</span>
                        </div>
                        <div className="delivery-row">
                            <span className="delivery-label">Телефон:</span>
                            <span className="delivery-value">{delivery.phone}</span>
                        </div>
                        <div className="delivery-row">
                            <span className="delivery-label">ИНН:</span>
                            <span className="delivery-value">{delivery.inn}</span>
                        </div>
                    </div>
                    <button className="edit-delivery-btn" onClick={() => setStep('delivery')}>
                        ️ Изменить
                    </button>
                </div>

                {/* Список товаров */}
                <div className="cart-section">
                    <h3 className="section-title">🛒 Ваши товары ({totalItems})</h3>
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <span className="empty-icon">📦</span>
                            <p>Корзина пуста</p>
                        </div>
                    ) : (
                        <div className="cart-items-list">
                            {cartItems.map(item => (
                                <div key={item.id} className="cart-item">
                                    <div className="cart-item-icon">{item.icon || '📦'}</div>
                                    <div className="cart-item-info">
                                        <div className="cart-item-title">{item.title}</div>
                                        <div className="cart-item-price">
                                            {item.price.toLocaleString('ru-RU')} ₽
                                        </div>
                                    </div>
                                    <div className="cart-item-controls">
                                        <div className="quantity-controls">
                                            <button className="qty-btn decrease" onClick={() => updateQuantity(item, -1)}>−</button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button className="qty-btn increase" onClick={() => updateQuantity(item, 1)}>+</button>
                                        </div>
                                        <button className="remove-btn" onClick={() => removeItem(item.id)} title="Удалить">
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 🔥 СЕКЦИЯ ПРОМОКОДА */}
                {features.promoCodes && (
                    <div className="promo-section">
                        <h3 className="section-title">🎟️ Промокод</h3>

                        {!appliedPromo ? (
                            <div className="promo-input-group">
                                <input
                                    className="form-input"
                                    type="text"
                                    placeholder="Введите промокод"
                                    value={promoCode}
                                    onChange={(e) => {
                                        setPromoCode(e.target.value.toUpperCase());
                                        setPromoError('');
                                    }}
                                    disabled={isCheckingPromo}
                                />
                                <button
                                    className="promo-apply-btn"
                                    onClick={handleCheckPromo}
                                    disabled={isCheckingPromo || !promoCode.trim()}
                                >
                                    {isCheckingPromo ? '...' : 'Применить'}
                                </button>
                            </div>
                        ) : (
                            <div className="promo-applied">
                                <div className="promo-info">
                                    <span className="promo-code-badge">{appliedPromo.code}</span>
                                    <span className="promo-description">{appliedPromo.description}</span>
                                </div>
                                <div className="promo-discount">
                                    −{appliedPromo.discountAmount.toLocaleString('ru-RU')} ₽
                                </div>
                                <button className="promo-remove-btn" onClick={handleRemovePromo}>
                                    ✕
                                </button>
                            </div>
                        )}

                        {promoError && (
                            <div className="promo-error">⚠️ {promoError}</div>
                        )}
                    </div>
                )}

                {/* Итого */}
                <div className="order-total-section">
                    <div className="total-row">
                        <span>Товары ({totalItems} шт.)</span>
                        <span>{originalTotalPrice.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    {promoDiscount > 0 && (
                        <div className="total-row discount-row">
                            <span>Скидка по промокоду</span>
                            <span className="discount-value">−{promoDiscount.toLocaleString('ru-RU')} ₽</span>
                        </div>
                    )}
                    <div className="total-row">
                        <span>Доставка</span>
                        <span className="free-delivery">Бесплатно</span>
                    </div>
                    <div className="total-row grand-total">
                        <span>Итого к оплате</span>
                        <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
                    </div>
                </div>

                {/* Способ оплаты */}
                <div className="payment-section">
                    <h3 className="section-title">💳 Способ оплаты</h3>
                    <div className="payment-options">
                        <label className={`payment-option ${paymentMethod === 'cash' ? 'active' : ''}`}>
                            <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={(e) => setPaymentMethod(e.target.value)} />
                            <span className="payment-icon">💵</span>
                            <span className="payment-text">Наличными при получении</span>
                        </label>
                        <label className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                            <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} />
                            <span className="payment-icon">💳</span>
                            <span className="payment-text">Картой при получении</span>
                        </label>
                        <label className={`payment-option ${paymentMethod === 'sbp' ? 'active' : ''}`}>
                            <input type="radio" name="payment" value="sbp" checked={paymentMethod === 'sbp'} onChange={(e) => setPaymentMethod(e.target.value)} />
                            <span className="payment-icon">⚡</span>
                            <span className="payment-text">СБП (по счету)</span>
                        </label>
                    </div>
                </div>

                {error && <div className="error-message">⚠️ {error}</div>}

                <button
                    className="submit-order-btn"
                    onClick={handleOrderSubmit}
                    disabled={cartItems.length === 0}
                >
                    {isDevMode
                        ? `Оплатить ${totalPrice.toLocaleString('ru-RU')} ₽ (тест)`
                        : `Оплатить ${totalPrice.toLocaleString('ru-RU')} ₽`}
                </button>
            </div>
        );
    }

    // ==========================================
    // ШАГ 1: ДАННЫЕ ДЛЯ ДОСТАВКИ
    // ==========================================
    return (
        <div className="form-container">
            <button className="back-button" onClick={onBack}>
                ← Назад к товарам
            </button>

            <h2 className="form-title">Данные для доставки</h2>

            <div className="form-group">
                <label className="form-label">
                    Город / Населенный пункт *
                    {!isDadataEnabled && <span className="dadata-disabled-hint"> (автоподсказки отключены)</span>}
                </label>
                <input
                    className="form-input"
                    type="text"
                    placeholder={isDadataEnabled ? "Начните вводить город" : "Введите город вручную"}
                    value={delivery.country}
                    onChange={(e) => setDelivery({ ...delivery, country: e.target.value })}
                />
                {citySuggestions.length > 0 && (
                    <div className="suggestions-dropdown">
                        {citySuggestions.map((suggestion, index) => (
                            <div key={index} className="suggestion-item" onMouseDown={() => setDelivery({ ...delivery, country: suggestion.value })}>
                                {suggestion.value}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="form-group">
                <label className="form-label">
                    Адрес доставки (улица, дом, офис) *
                    {!isDadataEnabled && <span className="dadata-disabled-hint"> (автоподсказки отключены)</span>}
                </label>
                <input
                    className="form-input"
                    type="text"
                    placeholder={isDadataEnabled ? "Начните вводить адрес" : "Введите адрес вручную"}
                    value={delivery.street}
                    onChange={(e) => setDelivery({ ...delivery, street: e.target.value })}
                />
                {addressSuggestions.length > 0 && (
                    <div className="suggestions-dropdown">
                        {addressSuggestions.map((suggestion, index) => (
                            <div key={index} className="suggestion-item" onMouseDown={() => setDelivery({ ...delivery, street: suggestion.value })}>
                                {suggestion.value}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="form-group">
                <label className="form-label">Контактный телефон *</label>
                <input
                    className="form-input"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={delivery.phone}
                    onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })}
                />
            </div>

            <div className="form-group">
                <label className="form-label">
                    ИНН организации или ИП *
                    {!isValidInn(delivery.inn) && delivery.inn.length > 0 && (
                        <span className="validation-error"> (должен быть 10 или 12 цифр)</span>
                    )}
                </label>
                <input
                    className={`form-input ${!isValidInn(delivery.inn) && delivery.inn.length > 0 ? 'input-error' : ''}`}
                    type="text"
                    placeholder="10 или 12 цифр"
                    value={delivery.inn}
                    onChange={(e) => {
                        const onlyNumbers = e.target.value.replace(/\D/g, '');
                        setDelivery({ ...delivery, inn: onlyNumbers });
                    }}
                    maxLength={12}
                />
            </div>

            {error && <div className="error-message">⚠️ {error}</div>}

            <button
                className="submit-order-btn"
                onClick={handleDeliveryConfirm}
                disabled={!isDeliveryValid}
            >
                Подтвердить адрес доставки →
            </button>
        </div>
    );
};

export default Form;