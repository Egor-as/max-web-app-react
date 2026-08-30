import React, { useState, useEffect } from 'react';
import './Form.css';
import { useMax } from '../../hooks/useMax';
import { useApi } from '../../hooks/useApi';
import { useDadata } from '../../hooks/useDadata';

const Form = ({ cartItems, setCartItems, onBack }) => {
    const { mx } = useMax();
    const { request } = useApi();

    // 🔥 Состояния шагов: 'delivery' | 'checkout' | 'processing' | 'success'
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

    // DaData
    const { suggestions: citySuggestions, isEnabled: isDadataEnabled } = useDadata(delivery.country);
    const { suggestions: addressSuggestions } = useDadata(delivery.street);

    // Проверка режима разработчика
    const isDevMode = process.env.REACT_APP_DEV_MODE === 'true';

    // Валидация ИНН
    const isValidInn = (inn) => /^\d{10}$|^\d{12}$/.test(inn);

    const isDeliveryValid =
        delivery.country.trim().length > 0 &&
        delivery.street.trim().length > 0 &&
        delivery.phone.trim().length >= 10 &&
        isValidInn(delivery.inn);

    // Подсчёт суммы
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Изменение количества товара
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

    // Удалить товар из корзины
    const removeItem = (productId) => {
        if (mx?.HapticFeedback) mx.HapticFeedback.notificationOccurred('warning');
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    // ==========================================
    // ШАГ 1: Переход к оформлению
    // ==========================================
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

    // ==========================================
    // ШАГ 2: Подтверждение заказа
    // ==========================================
    const handleOrderSubmit = async () => {
        if (cartItems.length === 0) {
            setError('Корзина пуста');
            return;
        }

        if (isDevMode) {
            // 🔥 Режим разработчика — показываем анимацию обработки
            setStep('processing');
            if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('heavy');

            // Имитация обработки заказа (2.5 секунды)
            setTimeout(() => {
                const fakeOrder = {
                    orderNumber: `ORD-DEV-${Date.now().toString(36).toUpperCase()}`,
                    totalPrice: totalPrice
                };
                setOrderSuccess(fakeOrder);
                setStep('success');
                setCartItems([]);
                if (mx?.HapticFeedback) mx.HapticFeedback.notificationOccurred('success');
            }, 2500);
        } else {
            // 🔥 Реальный режим — отправляем на сервер
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
                    payment: { method: paymentMethod }
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
    // ШАГ 4: Экран успеха с анимированной галочкой
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
                <p className="success-hint">
                    {isDevMode 
                        ? ' Это тестовый заказ (режим разработчика)' 
                        : 'Мы свяжемся с вами для подтверждения'}
                </p>
                <button 
                    className="action-btn primary" 
                    onClick={() => window.location.reload()}
                >
                    В главное меню
                </button>
            </div>
        );
    }

    // ==========================================
    // ШАГ 3: Анимация обработки заказа
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
    // ШАГ 2: Оформление заказа (товары + оплата)
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
                    <button 
                        className="edit-delivery-btn"
                        onClick={() => setStep('delivery')}
                    >
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
                                            <button 
                                                className="qty-btn decrease"
                                                onClick={() => updateQuantity(item, -1)}
                                            >
                                                −
                                            </button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button 
                                                className="qty-btn increase"
                                                onClick={() => updateQuantity(item, 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button 
                                            className="remove-btn"
                                            onClick={() => removeItem(item.id)}
                                            title="Удалить"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Итого */}
                <div className="order-total-section">
                    <div className="total-row">
                        <span>Товары ({totalItems} шт.)</span>
                        <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
                    </div>
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
                            <input
                                type="radio"
                                name="payment"
                                value="cash"
                                checked={paymentMethod === 'cash'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span className="payment-icon">💵</span>
                            <span className="payment-text">Наличными при получении</span>
                        </label>

                        <label className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                            <input
                                type="radio"
                                name="payment"
                                value="card"
                                checked={paymentMethod === 'card'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span className="payment-icon">💳</span>
                            <span className="payment-text">Картой при получении</span>
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
                            <span className="payment-text">СБП (по счету)</span>
                        </label>
                    </div>
                </div>

                {error && (
                    <div className="error-message">⚠️ {error}</div>
                )}

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
    // ШАГ 1: Данные для доставки
    // ==========================================
    return (
        <div className="form-container">
            <button className="back-button" onClick={onBack}>
                ← Назад к товарам
            </button>

            <h2 className="form-title">Данные для доставки</h2>

            {/* Город */}
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
                            <div
                                key={index}
                                className="suggestion-item"
                                onMouseDown={() => {
                                    setDelivery({ ...delivery, country: suggestion.value });
                                }}
                            >
                                {suggestion.value}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Адрес */}
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
                            <div
                                key={index}
                                className="suggestion-item"
                                onMouseDown={() => {
                                    setDelivery({ ...delivery, street: suggestion.value });
                                }}
                            >
                                {suggestion.value}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Телефон */}
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

            {/* ИНН */}
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

            {error && (
                <div className="error-message">️ {error}</div>
            )}

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