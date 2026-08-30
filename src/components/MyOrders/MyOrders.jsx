import React, { useState } from 'react';
import './MyOrders.css';
import { useMax } from '../../hooks/useMax';
import { useApi } from '../../hooks/useApi';

const MyOrders = ({ onBack }) => {
    const { mx } = useMax();
    const { request } = useApi();
    
    const [phone, setPhone] = useState('');
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!phone.trim() || phone.trim().length < 10) {
            setError('Введите корректный номер телефона');
            return;
        }

        setIsLoading(true);
        setError('');
        setHasSearched(true);

        try {
            const result = await request(`/api/orders/by-phone/${phone.trim()}`);
            setOrders(result.orders || []);
            
            if (mx?.HapticFeedback) mx.HapticFeedback.notificationOccurred('success');
        } catch (error) {
            setError('Ошибка загрузки заказов');
            console.error('Ошибка:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusName = (status) => {
        const names = {
            'new': 'Новый',
            'processing': 'В обработке',
            'paid': 'Оплачен',
            'shipped': 'Отправлен',
            'delivered': 'Доставлен',
            'cancelled': 'Отменён'
        };
        return names[status] || status;
    };

    const getStatusEmoji = (status) => {
        const emojis = {
            'new': '',
            'processing': '⚙️',
            'paid': '💰',
            'shipped': '📦',
            'delivered': '✅',
            'cancelled': '❌'
        };
        return emojis[status] || '📋';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="my-orders-container">
            {onBack && (
                <button className="back-button" onClick={onBack}>
                    ← Назад
                </button>
            )}

            <h2 className="page-title">Мои заказы</h2>
            <p className="page-subtitle">Введите номер телефона для просмотра истории заказов</p>

            {/* Форма поиска */}
            <div className="search-form">
                <div className="input-group">
                    <input
                        type="tel"
                        className="phone-input"
                        placeholder="+7 (999) 123-45-67"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        className="search-btn"
                        onClick={handleSearch}
                        disabled={isLoading}
                    >
                        {isLoading ? '🔍' : 'Найти'}
                    </button>
                </div>
                {error && <div className="error-message">{error}</div>}
            </div>

            {/* Результаты */}
            {hasSearched && !isLoading && (
                <>
                    {orders.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-icon">📦</span>
                            <p>Заказы не найдены</p>
                            <p className="empty-hint">
                                Попробуйте ввести другой номер телефона
                            </p>
                        </div>
                    ) : (
                        <div className="orders-list">
                            <div className="results-header">
                                Найдено заказов: {orders.length}
                            </div>
                            {orders.map(order => (
                                <div key={order.orderNumber} className="order-card">
                                    <div className="order-header">
                                        <span className="order-number">
                                            {order.orderNumber}
                                        </span>
                                        <span className="order-status">
                                            {getStatusEmoji(order.status)} {getStatusName(order.status)}
                                        </span>
                                    </div>
                                    <div className="order-date">
                                        {formatDate(order.createdAt)}
                                    </div>
                                    <div className="order-items">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="order-item">
                                                <span className="item-name">
                                                    {item.productTitle}
                                                </span>
                                                <span className="item-qty">
                                                    × {item.quantity}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="order-footer">
                                        <span className="order-total">
                                            Итого: {order.totalPrice.toLocaleString('ru-RU')} ₽
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyOrders;