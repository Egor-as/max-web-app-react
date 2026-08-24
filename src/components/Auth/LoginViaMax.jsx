import React from 'react';
import './LoginViaMax.css';

// ВАЖНО: Замените на реальный username вашего бота в Max (без @)
const BOT_USERNAME = new Bot(process.env.BOT_USERNAME);

const LoginViaMax = () => {
    // Формируем ссылку, которая откроет вашего бота в приложении Max
    // При переходе по ней бот сможет отправить пользователю кнопку для запуска Mini App
    const maxAppLink = `https://max.ru/${BOT_USERNAME}`;

    const handleOpenInMax = () => {
        // Пытаемся открыть приложение Max (работает на мобильных и десктопах)
        window.location.href = maxAppLink;
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-icon">🛡️</div>
                <h1 className="login-title">Вход через MAX</h1>
                <p className="login-description">
                    Для безопасности ваших данных и полноценной работы приложения, 
                    пожалуйста, откройте его непосредственно в мессенджере MAX.
                </p>
                
                <div className="login-steps">
                    <div className="step">
                        <span className="step-number">1</span>
                        <span>Нажмите кнопку ниже</span>
                    </div>
                    <div className="step">
                        <span className="step-number">2</span>
                        <span>Откройте диалог с ботом в приложении MAX</span>
                    </div>
                    <div className="step">
                        <span className="step-number">3</span>
                        <span>Нажмите «🛒 Открыть веб-магазин»</span>
                    </div>
                </div>

                <button className="login-button" onClick={handleOpenInMax}>
                    Открыть в приложении MAX →
                </button>

                <p className="login-note">
                    Если приложение MAX не открылось автоматически, 
                    найдите бота <strong>@{BOT_USERNAME}</strong> в поиске мессенджера вручную.
                </p>
            </div>
        </div>
    );
};

export default LoginViaMax;