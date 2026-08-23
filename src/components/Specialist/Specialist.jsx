import React, { useState } from 'react';
import '../Form/Form.css'; // Переиспользуем красивые стили из формы
import { useMax } from '../../hooks/useMax';

const Specialist = ({ onBack }) => {
    const [phone, setPhone] = useState('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { mx } = useMax();

    const handleSubmit = async () => {
        if (!phone.trim() || isSubmitting) return;
        
        setIsSubmitting(true);
        if (mx?.HapticFeedback) mx.HapticFeedback.impactOccurred('medium');

        try {
            // Имитация отправки заявки на сервер (задержка 1.5 сек)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            if (mx?.showAlert) {
                mx.showAlert({ message: 'Заявка отправлена! Специалист свяжется с вами в ближайшее время.' });
            } else {
                alert('Заявка отправлена! Специалист свяжется с вами.');
            }
            
            // Закрываем приложение после успешной отправки
            if (mx?.close) mx.close();
            
        } catch (error) {
            console.error('Ошибка:', error);
            if (mx?.showAlert) {
                mx.showAlert({ message: 'Ошибка отправки. Попробуйте позже.' });
            } else {
                alert('Ошибка отправки. Попробуйте позже.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-container">
            {onBack && (
                <button className="back-button" onClick={onBack} type="button">
                    ← Назад в главное меню
                </button>
            )}
            
            <h2 className="form-title">Вызов специалиста</h2>
            <p style={{ color: '#636366', marginBottom: '20px', fontSize: '15px' }}>
                Оставьте свои контакты, и мы перезвоним вам для уточнения деталей.
            </p>
            
            <div className="form-group">
                <label className="form-label">Ваш телефон *</label>
                <input
                    className="form-input"
                    type="tel"
                    placeholder="+7 (999) 000-00-00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isSubmitting}
                />
            </div>
            
            <div className="form-group">
                <label className="form-label">Комментарий (необязательно)</label>
                <input
                    className="form-input"
                    type="text"
                    placeholder="Опишите кратко вашу задачу"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={isSubmitting}
                />
            </div>

            <button
                className="submit-button"
                onClick={handleSubmit}
                disabled={!phone.trim() || isSubmitting}
                type="button"
            >
                {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
            </button>
        </div>
    );
};

// ВАЖНО: экспорт по умолчанию (без фигурных скобок при импорте)
export default Specialist;