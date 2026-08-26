import React, { useEffect, useState } from 'react';
import './LoginViaMax.css';
import { useMax } from '../../hooks/useMax';

/**
 * Компонент для авторизации через Max.
 * Используется как "обёртка" для защищённых экранов.
 * Если пользователь не авторизован в Max — показывает экран с просьбой открыть в Max.
 */
const LoginViaMax = ({ children, onAuthenticated }) => {
    const { mx, user } = useMax();
    const [status, setStatus] = useState('loading'); // loading | authenticated | need_max

    useEffect(() => {
        // Ждём 1 секунду, пока Max передаст данные
        const timer = setTimeout(() => {
            if (user && user.id) {
                setStatus('authenticated');
                if (onAuthenticated) onAuthenticated(user);
            } else {
                setStatus('need_max');
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [user, onAuthenticated]);

    // Экран загрузки
    if (status === 'loading') {
        return (
            <div className="login-max-container">
                <div className="login-max-spinner"></div>
                <h2 className="login-max-title">Подключение к Max...</h2>
                <p className="login-max-subtitle">Пожалуйста, подождите</p>
            </div>
        );
    }

    // Пользователь авторизован — показываем дочерний контент
    if (status === 'authenticated') {
        return <>{children}</>;
    }

    // Пользователь не в Max — показываем инструкцию
    return (
        <div className="login-max-container">
            <div className="login-max-icon">🔐</div>
            <h2 className="login-max-title">Требуется вход через Max</h2>
            <p className="login-max-subtitle">
                Для доступа к этой функции необходимо открыть приложение через мессенджер Max.
            </p>
            
            <div className="login-max-steps">
                <div className="login-max-step">
                    <span className="step-number">1</span>
                    <span className="step-text">Откройте мессенджер Max</span>
                </div>
                <div className="login-max-step">
                    <span className="step-number">2</span>
                    <span className="step-text">Найдите нашего бота</span>
                </div>
                <div className="login-max-step">
                    <span className="step-number">3</span>
                    <span className="step-text">Нажмите "Открыть веб-магазин"</span>
                </div>
            </div>

            <div className="login-max-info">
                <p>💡 Это нужно для вашей безопасности — так мы подтверждаем, что вы реальный пользователь.</p>
            </div>

            <button 
                className="login-max-button"
                onClick={() => {
                    if (mx?.close) mx.close();
                    else window.history.back();
                }}
            >
                Закрыть
            </button>
        </div>
    );
};

export default LoginViaMax;