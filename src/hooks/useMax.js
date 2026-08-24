// src/hooks/useMax.js
// ВРЕМЕННАЯ ВЕРСИЯ С ДИАГНОСТИКОЙ
// После проверки данных от Max вернемся к финальной версии

// 🔒 Безопасно получаем объект Max WebApp
// Если приложения нет в window (обычный браузер), создаем безопасную заглушку
const mx = window.WebApp || {
    ready: () => console.warn('[Max Mock] ready()'),
    expand: () => console.warn('[Max Mock] expand()'),
    close: () => {
        console.warn('[Max Mock] close() called');
        window.close();
    },
    MainButton: {
        show: () => {},
        hide: () => {},
        isVisible: false,
        setParams: () => {},
        setText: () => {},
        onClick: () => {},
        offClick: () => {},
        showProgress: () => {},
        hideProgress: () => {}
    },
    HapticFeedback: {
        impactOccurred: () => {},
        notificationOccurred: () => {}
    },
    initDataUnsafe: {},
    showAlert: (params) => alert(params.message || 'Alert')
};

export function useMax() {
    // Извлекаем данные пользователя
    const user = mx.initDataUnsafe?.user || null;
    const queryId = mx.initDataUnsafe?.query_id || null;
    const chat = mx.initDataUnsafe?.chat || null;
    const startParam = mx.initDataUnsafe?.start_param || null;

    // 🔥 ДИАГНОСТИКА: выводим всё, что есть в Max
    console.log('🔍 ========== Max диагностика ==========');
    console.log('window.WebApp существует:', !!window.WebApp);
    console.log('initDataUnsafe:', mx.initDataUnsafe);
    console.log('user:', user);
    console.log('queryId:', queryId);
    console.log('chat:', chat);
    console.log('startParam:', startParam);
    console.log('=========================================');

    // Функция закрытия приложения
    const onClose = () => {
        if (mx?.close) {
            mx.close();
        }
    };

    // Функция переключения MainButton
    const onToggleButton = () => {
        if (mx?.MainButton) {
            if (mx.MainButton.isVisible) {
                mx.MainButton.hide();
            } else {
                mx.MainButton.show();
            }
        }
    };

    return {
        // Объект Max WebApp (или mock в браузере)
        mx,
        
        // Функции управления приложением
        onClose,
        onToggleButton,
        
        // Данные пользователя
        user,
        queryId,
        chat,
        startParam,
        
        // 🔥 МЯГКАЯ ПРОВЕРКА: если есть window.WebApp — считаем, что мы внутри Mini App
        // Это не требует наличия user, просто проверяем наличие самого объекта
        isInsideMax: !!window.WebApp,
        
        // Флаг наличия нативной MainButton
        hasMainButton: !!window.WebApp?.MainButton,
    };
}