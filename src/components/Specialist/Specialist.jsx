import React, { useState } from 'react';
import './Specialist.css';
import { useMax } from '../../hooks/useMax';

const Specialist = ({ onBack }) => {
    const { mx } = useMax();
    
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [consultationType, setConsultationType] = useState('online');
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isFormValid = name.trim().length > 0 && phone.trim().length > 0;

    const handleSubmit = async () => {
        if (!isFormValid || isSubmitting) return;
        
        setIsSubmitting(true);
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('medium');

        // Имитация отправки
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log('📞 Заявка на вызов специалиста:', { name, phone, consultationType, comment });
        
        setSubmitted(true);
        setIsSubmitting(false);
        
        if (mx?.HapticFeedback) mx.HapticFeedback.notificationOccurred('success');
    };

    const handleClose = () => {
        if (mx?.close) {
            mx.close();
        } else {
            onBack?.();
        }
    };

    if (submitted) {
        return (
            <div className="specialist-container success-screen">
                <div className="success-icon">✓</div>
                <h2 className="success-title">Заявка принята!</h2>
                <p className="success-subtitle">
                    Наш специалист свяжется с вами в ближайшее время 📞
                </p>
                <div className="success-details">
                    <div className="detail-row">
                        <span className="detail-label">Имя:</span>
                        <span className="detail-value">{name}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Телефон:</span>
                        <span className="detail-value">{phone}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Формат:</span>
                        <span className="detail-value">
                            {consultationType === 'online' ? '🌐 Онлайн' : '🏢 Выезд'}
                        </span>
                    </div>
                </div>
                <button className="submit-button" onClick={handleClose}>
                    Закрыть
                </button>
            </div>
        );
    }

    return (
        <div className="specialist-container">
            {onBack && (
                <button className="back-button" onClick={onBack} type="button">
                    ← Назад
                </button>
            )}

            <div className="specialist-header">
                <div className="specialist-icon">👨‍💼</div>
                <h2 className="specialist-title">Вызов специалиста</h2>
                <p className="specialist-subtitle">
                    Оставьте заявку — мы перезвоним в течение 15 минут
                </p>
            </div>

            <div className="form-group">
                <label className="form-label">Ваше имя *</label>
                <input
                    className="form-input"
                    type="text"
                    placeholder="Например: Иван"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Телефон *</label>
                <input
                    className="form-input"
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isSubmitting}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Формат консультации</label>
                <div className="consultation-options">
                    <label className={`consultation-option ${consultationType === 'online' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            name="consultation"
                            value="online"
                            checked={consultationType === 'online'}
                            onChange={(e) => setConsultationType(e.target.value)}
                        />
                        <span className="consultation-icon">🌐</span>
                        <span className="consultation-text">
                            <strong>Онлайн</strong>
                            <small>Видеозвонок</small>
                        </span>
                    </label>
                    <label className={`consultation-option ${consultationType === 'offline' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            name="consultation"
                            value="offline"
                            checked={consultationType === 'offline'}
                            onChange={(e) => setConsultationType(e.target.value)}
                        />
                        <span className="consultation-icon">🏢</span>
                        <span className="consultation-text">
                            <strong>Выезд</strong>
                            <small>К вам в офис</small>
                        </span>
                    </label>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Комментарий (необязательно)</label>
                <textarea
                    className="form-textarea"
                    placeholder="Опишите вашу задачу или вопрос..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={isSubmitting}
                    rows={3}
                />
            </div>

            <button
                className="submit-button"
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                type="button"
            >
                {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
            </button>
        </div>
    );
};

export default Specialist;