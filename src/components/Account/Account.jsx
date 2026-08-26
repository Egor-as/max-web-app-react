import React, { useState, useEffect } from 'react';
import './Account.css';
import { useMax } from '../../hooks/useMax';
import { useApi } from '../../hooks/useApi';

const Account = ({ onBack }) => {
    const { mx } = useMax();
    const { request } = useApi();
    const [phone, setPhone] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedPhone = localStorage.getItem('currentUserPhone');
        if (savedPhone) {
            setPhone(savedPhone);
            loadOrders(savedPhone);
        }
    }, []);

    const loadOrders = async (phoneNumber) => {
        setLoading(true);
        try {
            const result = await request(`/api/orders/by-phone/${encodeURIComponent(phoneNumber)}`);
            setOrders(result.orders || []);
            setIsLoggedIn(true);
        } catch (error) {
            alert(`Ошибка: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {
        if (phone.trim().length < 5) {
            alert('Введите корректный номер телефона');
            return;
        }
        localStorage.setItem('currentUserPhone', phone.trim());
        loadOrders(phone.trim());
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUserPhone');
        setIsLoggedIn(false);
        setPhone('');
        setOrders([]);
    };

    const getLicenseStatus = (order) => {
        if (!order.createdAt) return { text: '—', color: '#636366' };
        const startDate = new Date(order.createdAt);
        const endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 1);
        const now = new Date();
        const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        if (daysLeft < 0) return { text: 'Истекла', color: '#ff3b30' };
        if (daysLeft < 30) return { text: `Осталось ${daysLeft} дн.`, color: '#ff9500' };
        return { text: `Активна`, color: '#34c759' };
    };

    if (!isLoggedIn) {
        return (
            <div className="account-container">
                {onBack && <button className="back-button" onClick={onBack}>← Назад</button>}
                <div className="account-login">
                    <div className="login-icon">👤</div>
                    <h2 className="login-title">Личный кабинет</h2>
                    <p className="login-subtitle">Введите номер телефона</p>
                    <div className="form-group"><label className="form-label">Телефон</label><input className="form-input" type="tel" placeholder="+7 (999) 123-45-67" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                    <button className="submit-button" onClick={handleLogin} disabled={loading}>{loading ? 'Загрузка...' : 'Войти'}</button>
                </div>
            </div>
        );
    }

    return (
        <div className="account-container">
            {onBack && <button className="back-button" onClick={onBack}>← Назад</button>}
            <div className="account-header">
                <div className="account-avatar">👤</div>
                <div className="account-info">
                    <h2 className="account-title">Мои покупки</h2>
                    <p className="account-phone">{phone}</p>
                </div>
                <button className="logout-btn" onClick={handleLogout}>Выйти</button>
            </div>
            {orders.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">📦</div><h3>Пока нет покупок</h3></div>
            ) : (
                <div className="orders-list">
                    <h3 className="section-title">История заказов ({orders.length})</h3>
                    {orders.map(order => {
                        const licenseStatus = getLicenseStatus(order);
                        return (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <span className="order-number">{order.orderNumber}</span>
                                    <span className="order-status" style={{ color: licenseStatus.color }}>{licenseStatus.text}</span>
                                </div>
                                <div className="order-date">📅 {new Date(order.createdAt).toLocaleDateString('ru-RU')}</div>
                                <div className="order-items">
                                    {order.items?.map((item, idx) => (
                                        <div key={idx} className="order-item-row">
                                            <span className="item-title">{item.productTitle}</span>
                                            <span className="item-qty">× {item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="order-footer">
                                    <span className="order-total">💰 {order.totalPrice.toLocaleString('ru-RU')} ₽</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Account;