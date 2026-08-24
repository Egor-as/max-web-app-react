// src/hooks/useMax.js
// Универсальный хук для работы с API мессенджера Max
// Безопасно работает и внутри Max, и в обычном браузере (через заглушки)

// 🔒 Безопасно получаем объект Max WebApp
// Если приложения нет в window (обычный браузер), создаем безопасную заглушку (mock),
// чтобы код не падал с ошибкой "Cannot read property of undefined"
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

// 🔥 Главный флаг: находимся ли мы внутри приложения Max
// true = приложение открыто в Max (есть initDataUnsafe.user)
// false = приложение открыто в обычном браузере (нужна авторизация)
const isInsideMax = !!window.WebApp && !!mx.initDataUnsafe?.user;

export function useMax() {
    // Извлекаем данные пользователя из initDataUnsafe
    const user = mx.initDataUnsafe?.user || null;
    const queryId = mx.initDataUnsafe?.query_id || null;
    const chat = mx.initDataUnsafe?.chat || null;
    const startParam = mx.initDataUnsafe?.start_param || null;

    // Проверяем, есть ли нативная MainButton (есть в Telegram, нет в Max)
    const hasMainButton = !!window.WebApp?.MainButton;

    // Функция закрытия приложения
    const onClose = () => {
        if (mx?.close) {
            mx.close();
        }
    };

    // Функция переключения видимости нативной MainButton
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
        
        // 🔥 Ключевой флаг для проверки авторизации
        isInsideMax,
        
        // Функции управления приложением
        onClose,
        onToggleButton,
        
        // Данные пользователя (null, если открыто в браузере)
        user,
        queryId,
        chat,
        startParam,
        
        // Флаг наличия нативной MainButton
        hasMainButton,
    };
}