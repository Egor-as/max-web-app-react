import React from 'react';
import './MainMenu.css';
import { useMax } from '../../hooks/useMax';
import { useFeatures } from '../../hooks/useFeatures';

const MainMenu = ({ onNavigate }) => {
    const { mx, user } = useMax();
    const features = useFeatures();
    
    const handleHaptic = () => {
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('medium');
    };

    return (
        <div className="main-menu-container">
            <div className="welcome-header">
                <div className="welcome-logo">🛍️</div>
                <h1 className="main-title">
                    {user ? `Привет, ${user.first_name}!` : 'Добро пожаловать!'}
                </h1>
                <p className="main-description">
                    Торговое оборудование для вашего бизнеса
                </p>
            </div>
            
            <div className="menu-buttons">
                <button 
                    className="menu-btn primary-btn"
                    onClick={() => { handleHaptic(); onNavigate('categories'); }}
                >
                    <span className="menu-btn-icon">🛒</span>
                    <span className="menu-btn-text">
                        <span className="menu-btn-title">Купить оборудование</span>
                        <span className="menu-btn-subtitle">Каталог товаров</span>
                    </span>
                    <span className="menu-btn-arrow">→</span>
                </button>
                
                <button 
                    className="menu-btn secondary-btn"
                    onClick={() => { handleHaptic(); onNavigate('specialist'); }}
                >
                    <span className="menu-btn-icon">🛠️</span>
                    <span className="menu-btn-text">
                        <span className="menu-btn-title">Вызов специалиста</span>
                        <span className="menu-btn-subtitle">Консультация и настройка</span>
                    </span>
                    <span className="menu-btn-arrow">→</span>
                </button>

                {/* Мои заказы */}
                <button 
                    className="menu-btn orders-btn"
                    onClick={() => { handleHaptic(); onNavigate('my-orders'); }}
                >
                    <span className="menu-btn-icon">📋</span>
                    <span className="menu-btn-text">
                        <span className="menu-btn-title">Мои заказы</span>
                        <span className="menu-btn-subtitle">История покупок</span>
                    </span>
                    <span className="menu-btn-arrow">→</span>
                </button>

                {/* Избранное — только если включено */}
                {features.wishlist && (
                    <button 
                        className="menu-btn wishlist-btn"
                        onClick={() => { handleHaptic(); onNavigate('wishlist'); }}
                    >
                        <span className="menu-btn-icon">❤️</span>
                        <span className="menu-btn-text">
                            <span className="menu-btn-title">Избранное</span>
                            <span className="menu-btn-subtitle">Сохранённые товары</span>
                        </span>
                        <span className="menu-btn-arrow">→</span>
                    </button>
                )}

                {/* Сравнение — только если включено */}
                {features.comparison && (
                    <button 
                        className="menu-btn comparison-btn"
                        onClick={() => { handleHaptic(); onNavigate('comparison'); }}
                    >
                        <span className="menu-btn-icon">⚖️</span>
                        <span className="menu-btn-text">
                            <span className="menu-btn-title">Сравнение</span>
                            <span className="menu-btn-subtitle">Сравнить товары</span>
                        </span>
                        <span className="menu-btn-arrow">→</span>
                    </button>
                )}

                {/* Личный кабинет */}
                <button 
                    className="menu-btn accent-btn"
                    onClick={() => { handleHaptic(); onNavigate('account'); }}
                >
                    <span className="menu-btn-icon">👤</span>
                    <span className="menu-btn-text">
                        <span className="menu-btn-title">Личный кабинет</span>
                        <span className="menu-btn-subtitle">Мои покупки и лицензии</span>
                    </span>
                    <span className="menu-btn-arrow">→</span>
                </button>
                
                {/* Админ-панель */}
                <button 
                    className="menu-btn admin-btn"
                    onClick={() => { handleHaptic(); onNavigate('admin'); }}
                >
                    <span className="menu-btn-icon">⚙️</span>
                    <span className="menu-btn-text">
                        <span className="menu-btn-title">Админ-панель</span>
                        <span className="menu-btn-subtitle">Управление товарами</span>
                    </span>
                    <span className="menu-btn-arrow">→</span>
                </button>
            </div>
            
            <div className="menu-footer">
                <div className="footer-item">
                    <span className="footer-icon">🚚</span>
                    <span>Быстрая доставка</span>
                </div>
                <div className="footer-item">
                    <span className="footer-icon"></span>
                    <span>Удобная оплата</span>
                </div>
                <div className="footer-item">
                    <span className="footer-icon">🎧</span>
                    <span>Поддержка 24/7</span>
                </div>
            </div>
        </div>
    );
};

export default MainMenu;