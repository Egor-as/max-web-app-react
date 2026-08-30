import React, { useState, useEffect } from 'react';
import './Admin.css';
import { useMax } from '../../hooks/useMax';
import { useApi } from '../../hooks/useApi';

const AdminOrders = ({ adminToken, onBack }) => {
    const { mx } = useMax();
    const { request } = useApi();
    
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        loadOrders();
    }, [filterStatus]);

    const loadOrders = async () => {
        setIsLoading(true);
        try {
            const params = filterStatus !== 'all' ? `?status=${filterStatus}` : '';
            const result = await request(`/api/admin/orders${params}`, {
                headers: { 'x-admin-token': adminToken }
            });
            setOrders(result.orders || []);
        } catch (error) {
            console.error('Ошибка загрузки заказов:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (orderNumber, newStatus) => {
        if (!window.confirm(`Изменить статус заказа ${orderNumber} на "${getStatusName(newStatus)}"?`)) {
            return;
        }

        try {
            await request(`/api/admin/orders/${orderNumber}/status`, {
                method: 'PUT',
                headers: { 'x-admin-token': adminToken },
                body: JSON.stringify({ status: newStatus })
            });
            
            if (mx?.HapticFeedback) mx.HapticFeedback.notificationOccurred('success');
            loadOrders();
        } catch (error) {
            alert(`Ошибка: ${error.message}`);
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
            'new': '🆕',
            'processing': '⚙️',
            'paid': '💰',
            'shipped': '📦',
            'delivered': '✅',
            'cancelled': '❌'
        };
        return emojis[status] || '';
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

    if (selectedOrder) {
        return (
            <div className="admin-container">
                <button className="back-button" onClick={() => setSelectedOrder(null)}>
                    ← Назад к списку
                </button>
                
                <div className="order-details">
                    <h2 className="admin-title">Заказ {selectedOrder.orderNumber}</h2>
                    
                    <div className="order-info-card">
                        <div className="info-row">
                            <span className="info-label">Статус:</span>
                            <span className="info-value">
                                {getStatusEmoji(selectedOrder.status)} {getStatusName(selectedOrder.status)}
                            </span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Дата:</span>
                            <span className="info-value">{formatDate(selectedOrder.createdAt)}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Телефон:</span>
                            <span className="info-value">{selectedOrder.phone}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">ИНН:</span>
                            <span className="info-value">{selectedOrder.inn || '—'}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Адрес:</span>
                            <span className="info-value">
                                {selectedOrder.deliveryCountry}, {selectedOrder.deliveryStreet}
                            </span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Оплата:</span>
                            <span className="info-value">
                                {selectedOrder.paymentMethod === 'cash' ? 'Наличными' : 
                                 selectedOrder.paymentMethod === 'card' ? 'Картой' : 
                                 selectedOrder.paymentMethod === 'sbp' ? 'СБП' : selectedOrder.paymentMethod}
                            </span>
                        </div>
                        <div className="info-row total">
                            <span className="info-label">Сумма:</span>
                            <span className="info-value price">
                                {selectedOrder.totalPrice.toLocaleString('ru-RU')} ₽
                            </span>
                        </div>
                    </div>

                    <h3 className="section-title">Товары:</h3>
                    <div className="order-items-list">
                        {selectedOrder.items.map((item, index) => (
                            <div key={index} className="order-item-row">
                                <span className="item-title">{item.productTitle}</span>
                                <span className="item-quantity">× {item.quantity}</span>
                                <span className="item-price">
                                    {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                                </span>
                            </div>
                        ))}
                    </div>

                    <h3 className="section-title">Изменить статус:</h3>
                    <div className="status-buttons">
                        {['new', 'processing', 'paid', 'shipped', 'delivered', 'cancelled'].map(status => (
                            <button
                                key={status}
                                className={`status-btn ${selectedOrder.status === status ? 'active' : ''}`}
                                onClick={() => handleStatusChange(selectedOrder.orderNumber, status)}
                                disabled={selectedOrder.status === status}
                            >
                                {getStatusEmoji(status)} {getStatusName(status)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            {onBack && (
                <button className="back-button" onClick={onBack}>
                    ← Назад
                </button>
            )}
            
            <h2 className="admin-title">📋 Управление заказами</h2>
            
            {/* Фильтр по статусу */}
            <div className="status-filter">
                <button
                    className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('all')}
                >
                    Все ({orders.length})
                </button>
                <button
                    className={`filter-btn ${filterStatus === 'new' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('new')}
                >
                    🆕 Новые
                </button>
                <button
                    className={`filter-btn ${filterStatus === 'paid' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('paid')}
                >
                    💰 Оплаченные
                </button>
                <button
                    className={`filter-btn ${filterStatus === 'delivered' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('delivered')}
                >
                    ✅ Доставленные
                </button>
            </div>

            {/* Список заказов */}
            {isLoading ? (
                <div className="loading-state">Загрузка заказов...</div>
            ) : orders.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📦</span>
                    <p>Заказы не найдены</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div
                            key={order.orderNumber}
                            className="order-card"
                            onClick={() => setSelectedOrder(order)}
                        >
                            <div className="order-header">
                                <span className="order-number">{order.orderNumber}</span>
                                <span className="order-status">
                                    {getStatusEmoji(order.status)} {getStatusName(order.status)}
                                </span>
                            </div>
                            <div className="order-body">
                                <div className="order-info">
                                    <div className="order-date">{formatDate(order.createdAt)}</div>
                                    <div className="order-phone">📞 {order.phone}</div>
                                    <div className="order-address">
                                         {order.deliveryCountry}, {order.deliveryStreet}
                                    </div>
                                </div>
                                <div className="order-total">
                                    {order.totalPrice.toLocaleString('ru-RU')} ₽
                                </div>
                            </div>
                            <div className="order-items-preview">
                                {order.items.slice(0, 2).map((item, idx) => (
                                    <span key={idx} className="item-preview">
                                        {item.productTitle} × {item.quantity}
                                    </span>
                                ))}
                                {order.items.length > 2 && (
                                    <span className="more-items">
                                        +{order.items.length - 2} ещё
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminOrders;