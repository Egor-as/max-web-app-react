import React, { useState, useEffect } from 'react';
import './Account.css';
import { useMax } from '../../hooks/useMax';

const Account = ({ orders, onBack }) => {
    const { mx } = useMax();
    const [phone, setPhone] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userOrders, setUserOrders] = useState([]);

    // Проверяем, не вошёл ли пользователь ранее
    useEffect(() => {
        const savedPhone = localStorage.getItem('currentUserPhone');
        if (savedPhone) {
            setPhone(savedPhone);
            setIsLoggedIn(true);
            filterOrdersByPhone(savedPhone);
        }
    }, [orders]);

    const filterOrdersByPhone = (phoneNumber) => {
        const filtered = orders.filter(o => o.phone === phoneNumber);
        setUserOrders(filtered);
    };

    const handleLogin = () => {
        if (phone.trim().length < 5) {
            if (mx?.showAlert) {
                mx.showAlert({ message: 'Введите корректный номер телефона' });
            } else {
                alert('Введите корректный номер телефона');
            }
            return;
        }

        localStorage.setItem('currentUserPhone', phone.trim());
        setIsLoggedIn(true);
        filterOrdersByPhone(phone.trim());

        if (mx?.HapticFeedback) mx.HapticFeedback.notificationOccurred('success');
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUserPhone');
        setIsLoggedIn(false);
        setPhone('');
        setUserOrders([]);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU');
    };

    const getLicenseStatus = (order) => {
        // Имитация: лицензии действуют 1 год с момента покупки
        if (!order.createdAt) return { status: 'unknown', text: '—', color: '#636366' };
        
        const startDate = new Date(order.createdAt);
        const endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 1);
        const now = new Date();
        const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

        if (daysLeft < 0) {
            return { status: 'expired', text: 'Истекла', color: '#ff3b30' };
        } else if (daysLeft < 30) {
            return { status: 'expiring', text: `Осталось ${daysLeft} дн.`, color: '#ff9500' };
        } else {
            return { status: 'active', text: `Активна (${daysLeft} дн.)`, color: '#34c759' };
        }
    };

    // ============================================
    // ЭКРАН ВХОДА ПО ТЕЛЕФОНУ
    // ============================================
    if (!isLoggedIn) {
        return (
            <div className="account-container">
                {onBack && (
                    <button className="back-button" onClick={onBack}>← Назад</button>
                )}
                
                <div className="account-login">
                    <div className="login-icon">👤</div>
                    <h2 className="login-title">Личный кабинет</h2>
                    <p className="login-subtitle">
                        Введите номер телефона, который вы указывали при оформлении заказа
                    </p>
                    
                    <div className="form-group">
                        <label className="form-label">Номер телефона</label>
                        <input
                            className="form-input"
                            type="tel"
                            placeholder="+7 (___) ___-__-__"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    
                    <button className="submit-button" onClick={handleLogin}>
                        Войти
                    </button>
                </div>
            </div>
        );
    }

    // ============================================
    // ЭКРАН ЛИЧНОГО КАБИНЕТА
    // ============================================
    return (
        <div className="account-container">
            {onBack && (
                <button className="back-button" onClick={onBack}>← Назад</button>
            )}

            <div className="account-header">
                <div className="account-avatar">👤</div>
                <div className="account-info">
                    <h2 className="account-title">Мои покупки</h2>
                    <p className="account-phone">{phone}</p>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    Выйти
                </button>
            </div>

            {userOrders.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <h3>Пока нет покупок</h3>
                    <p>Ваши заказы появятся здесь после оформления</p>
                </div>
            ) : (
                <div className="orders-list">
                    <h3 className="section-title">История заказов ({userOrders.length})</h3>
                    
                    {userOrders.map(order => {
                        const licenseStatus = getLicenseStatus(order);
                        
                        return (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <span className="order-number">{order.orderNumber}</span>
                                    <span className="order-status" style={{ color: licenseStatus.color }}>
                                        {licenseStatus.text}
                                    </span>
                                </div>
                                
                                <div className="order-date">
                                    📅 {formatDate(order.createdAt)}
                                </div>
                                
                                <div className="order-items">
                                    {order.items?.map((item, idx) => (
                                        <div key={idx} className="order-item-row">
                                            <span className="item-title">{item.title}</span>
                                            <span className="item-qty">× {item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="order-footer">
                                    <span className="order-total">
                                        💰 {order.totalPrice?.toLocaleString('ru-RU')} ₽
                                    </span>
                                    <span className="order-payment">
                                        {order.paymentMethod === 'card' && '💳'}
                                        {order.paymentMethod === 'sbp' && '⚡'}
                                        {order.paymentMethod === 'cash' && '💵'}
                                    </span>
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