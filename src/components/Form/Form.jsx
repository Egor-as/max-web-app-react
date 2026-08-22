import React, { useState, useCallback } from 'react';
import './Form.css';
import { useMax } from '../../hooks/useMax';

const Form = () => {
    const [country, setCountry] = useState('');
    const [street, setStreet] = useState('');
    const [subject, setSubject] = useState('physical');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { mx } = useMax();

    // Проверка валидности формы
    const isFormValid = country.trim().length > 0 && street.trim().length > 0;

    // Функция отправки данных
    const onSendData = useCallback(async () => {
        if (!isFormValid || isSubmitting || !mx) return;

        setIsSubmitting(true);

        // Виброотклик при отправке (если поддерживается)
        if (mx.HapticFeedback) {
            mx.HapticFeedback.impactOccurred('medium');
        }

        try {
            const data = {
                country: country.trim(),
                street: street.trim(),
                subject
            };

            // Отправка данных через встроенный метод sendData
            // (в Max это работает через window.WebApp.sendData)
            mx.sendData(JSON.stringify(data));

            // Показываем уведомление об успехе
            if (mx.showAlert) {
                mx.showAlert({ message: 'Данные успешно отправлены!' });
            } else {
                alert('Данные успешно отправлены!');
            }

            // Опционально: закрываем приложение после отправки
            // if (mx.close) mx.close();

        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
            
            if (mx.showAlert) {
                mx.showAlert({ message: 'Не удалось отправить данные. Попробуйте еще раз.' });
            } else {
                alert('Не удалось отправить данные. Попробуйте еще раз.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [country, street, subject, isFormValid, isSubmitting, mx]);

    // Обработчики изменений
    const onChangeCountry = (e) => setCountry(e.target.value);
    const onChangeStreet = (e) => setStreet(e.target.value);
    const onChangeSubject = (e) => setSubject(e.target.value);

    return (
        <div className="form">
            <h3>Введите ваши данные</h3>
            
            <input
                className="input"
                type="text"
                placeholder="Страна"
                value={country}
                onChange={onChangeCountry}
                disabled={isSubmitting}
            />
            
            <input
                className="input"
                type="text"
                placeholder="Улица"
                value={street}
                onChange={onChangeStreet}
                disabled={isSubmitting}
            />
            
            <select 
                value={subject} 
                onChange={onChangeSubject} 
                className="select"
                disabled={isSubmitting}
            >
                <option value="physical">Физ. лицо</option>
                <option value="legal">Юр. лицо</option>
            </select>

            {/* Собственная кнопка вместо MainButton */}
            <button
                className="submit-button"
                onClick={onSendData}
                disabled={!isFormValid || isSubmitting}
            >
                {isSubmitting ? 'Отправка...' : 'Отправить данные'}
            </button>
            <button onClick={onBack}>← Назад к товарам</button>
        </div>
    );
};

export default Form;