import React, { useEffect, useState } from 'react';
import './PaymentSuccess.css';
import { useApi } from '../../hooks/useApi';

const PaymentSuccess = () => {
    const { request } = useApi();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { checkPaymentStatus(); }, []);

    const checkPaymentStatus = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const orderNumber = urlParams.get('order');
        if (!orderNumber) { setLoading(false); return; }
        try {
            const result = await request(`/api/payments/status/${orderNumber}`);
            setOrderData(result);
        } catch (error) { console.error('Ошибка проверки статуса:', error); }
        finally { setLoading(false); }
    };

    if (loading) {
        return (
            <div className="payment-result-container">
                <div className="processing-spinner"></div>
                <h2>Проверяем статус платежа...</h2>
            </div>
        );
    }

    return (
        <div className="payment-result-container success">
            <div className="result-icon">✓</div>
            <h1 className="result-title">Оплата прошла успешно!</h1>
            <p className="result-subtitle">Спасибо за покупку 🎉</p>
            {orderData && (
                <div className="result-details">
                    <div className="detail-row"><span>Номер заказа:</span><strong>{orderData.orderNumber}</strong></div>
                    <div className="detail-row"><span>Статус:</span><strong style={{ color: '#34c759' }}>{orderData.paymentStatus === 'paid' ? '✅ Оплачен' : '⏳ В обработке'}</strong></div>
                </div>
            )}
            <div className="result-tips">
                <p>📞 Менеджер свяжется с вами в ближайшее время</p>
                <p>👤 Заказ сохранён в вашем личном кабинете</p>
            </div>
            <button className="close-button" onClick={() => { if (window.WebApp?.close) window.WebApp.close(); else window.close(); }}>Закрыть</button>
        </div>
    );
};

export default PaymentSuccess;