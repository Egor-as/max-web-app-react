// src/hooks/useMax.js
// Безопасно получаем объект. Если приложения нет в окне (обычный браузер),
// создаем безопасную заглушку (mock), чтобы код не падал с ошибкой.
const mx = window.WebApp || {
    ready: () => console.warn('Mock: ready()'),
    expand: () => console.warn('Mock: expand()'),
    close: () => {
        console.warn('Mock: close() called');
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

// Проверяем, есть ли нативная MainButton (есть в Telegram, нет в Max)
const hasMainButton = !!window.WebApp?.MainButton;

export function useMax() {
    const onClose = () => {
        if (mx?.close) {
            mx.close();
        }
    };

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
        onClose,
        onToggleButton,
        mx,
        hasMainButton,
        user: mx.initDataUnsafe?.user || null,
        queryId: mx.initDataUnsafe?.query_id || null,
        chat: mx.initDataUnsafe?.chat || null,
        startParam: mx.initDataUnsafe?.start_param || null,
    };
}