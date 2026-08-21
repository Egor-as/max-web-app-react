import React, { useCallback, useEffect, useState } from 'react';
import './Form.css';
import { useMax } from '../../hooks/useMax';

const Form = () => {
    const [country, setCountry] = useState('');
    const [street, setStreet] = useState('');
    const [subject, setSubject] = useState('physical');
    const { mx } = useMax();

    // Функция отправки данных
    const onSendData = useCallback(() => {
        if (!mx) return; // Защита на случай, если mx исчезнет

        const data = { country, street, subject };
        mx.sendData(JSON.stringify(data));
    }, [country, street, subject, mx]); // Добавили mx в зависимости

    // Единый эффект для управления MainButton
    useEffect(() => {
        // Защита от обращения к несуществующему объекту
        if (!mx || !mx.MainButton) {
            console.warn('MainButton недоступна');
            return;
        }

        // Настройка параметров кнопки (текст)
        mx.MainButton.setParams({
            text: 'Отправить данные'
        });

        // Проверка валидности: пустая строка !== undefined/null, но мы проверяем именно длину
        const isFormValid = country.trim().length > 0 && street.trim().length > 0;

        if (isFormValid) {
            mx.MainButton.show();
            mx.MainButton.onClick(onSendData); // Подписываемся на клик
        } else {
            mx.MainButton.hide();
            mx.MainButton.offClick(onSendData); // Отписываемся от клика
        }

        // Cleanup функция для отписки при размонтировании
        return () => {
            if (mx && mx.MainButton) {
                mx.MainButton.offClick(onSendData);
            }
        };
    }, [country, street, mx, onSendData]); // Зависимости обновляют кнопку при любом изменении

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
            />
            <input
                className="input"
                type="text"
                placeholder="Улица"
                value={street}
                onChange={onChangeStreet}
            />
            <select value={subject} onChange={onChangeSubject} className="select">
                <option value="physical">Физ. лицо</option>
                <option value="legal">Юр. лицо</option>
            </select>
        </div>
    );
};

export default Form;