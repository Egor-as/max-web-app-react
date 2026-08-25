import React from 'react';
import './MainMenu.css';
import { useMax } from '../../hooks/useMax';

const MainMenu = ({ onNavigate }) => {
    const { mx, user } = useMax();

    const handleHaptic = () => {
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('medium');
    };

    return (
        <div className="main-menu-container">
            <div className="welcome-header">
                <h1 className="main-title">Добро пожаловать!</h1>
                {user && <p className="main-subtitle">Рады видеть вас, {user.first_name} 👋</p>}
                <p className="main-description">Выберите необходимое действие:</p>
            </div>
            
            <div className="menu-buttons">
                {/* 🔥 Теперь открывает список категорий, а не сразу товары */}
                <button 
                    className="menu-btn primary-btn"
                    onClick={() => { handleHaptic(); onNavigate('categories'); }}
                >
                    🛒 Купить оборудование
                </button>
                
                <button 
                    className="menu-btn secondary-btn"
                    onClick={() => { handleHaptic(); onNavigate('specialist'); }}
                >
                    🛠️ Вызов специалиста
                </button>
            </div>
        </div>
    );
};

export default MainMenu;