const onSendData = useCallback(async () => {
    console.log('🔵 Кнопка "Оформить заказ" нажата');
    console.log('🔵 isSubmitting:', isSubmitting);
    console.log('🔵 cartItems:', cartItems);
    
    if (isSubmitting) {
        console.warn('⚠️ Запрос уже выполняется, игнорируем повторный клик');
        return;
    }

    setIsSubmitting(true);
    console.log('🔵 Начинаем отправку заказа...');

    try {
        const payload = {
            items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
            queryId,
        };
        
        console.log('🔵 Payload для отправки:', payload);
        console.log('🔵 URL:', 'https://85.119.146.179:8000/web-data');

        const response = await fetch('https://85.119.146.179:8000/web-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log('🔵 Получен ответ от сервера, статус:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Ошибка сервера:', response.status, errorText);
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Заказ успешно оформлен!', result);

        setCartItems([]);
        
        if (mx?.showAlert) {
            mx.showAlert({ message: 'Заказ успешно оформлен!' });
        } else {
            alert('Заказ успешно оформлен!');
        }
        
        if (mx?.close) mx.close();

    } catch (error) {
        console.error('❌ Критическая ошибка при отправке заказа:', error);
        console.error('❌ Тип ошибки:', error.name);
        console.error('❌ Сообщение:', error.message);
        
        // Показываем ошибку пользователю
        const errorMessage = error.message || 'Неизвестная ошибка';
        if (mx?.showAlert) {
            mx.showAlert({ message: `Ошибка: ${errorMessage}` });
        } else {
            alert(`Не удалось оформить заказ.\nДетали: ${errorMessage}`);
        }
    } finally {
        console.log('🔵 Завершаем отправку, сбрасываем isSubmitting');
        setIsSubmitting(false);
    }
}, [cartItems, isSubmitting, mx, queryId]);