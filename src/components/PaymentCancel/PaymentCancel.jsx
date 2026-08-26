import React from 'react';
import './PaymentCancel.css';

const PaymentCancel = () => {
    const handleClose = () => {
        if (window.WebApp?.close) window.WebApp.close();
        else window.history.back();
    };

    return (
        <div className="payment-result-container cancel">
            <div className="result-icon">✕</div>
            <h1 className="result-title">Оплата отменена</h1>
            <p className="result-subtitle">Вы можете попробовать снова или выбрать другой способ оплаты</p>
            <div className="result-tips">
                <p>💳 Проверьте данные карты</p>
                <p>📞 Или свяжитесь с нами для помощи</p>
            </div>
            <button className="close-button" onClick={handleClose}>Закрыть</button>
        </div>
    );
};

export default PaymentCancel;