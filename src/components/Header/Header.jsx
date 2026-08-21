import React from 'react';
import Button from "../Button/Button";
import { useMax } from '../../hooks/useMax';
import './Header.css';

const Header = () => {
    const { user, onClose } = useMax();

    // Обработчик закрытия с проверкой
    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            console.warn('Метод onClose недоступен');
            // Альтернатива: window.close() или редирект
        }
    };

    return (
        <div className="header">
            <Button onClick={handleClose}>Закрыть</Button>
            <span className="username">
                {user?.username || 'Гость'}
            </span>
        </div>
    );
};

export default Header;