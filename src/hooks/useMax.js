// src/hooks/useMax.js

// 1. ЭТА ЧАСТЬ ОБЯЗАТЕЛЬНА! Она должна быть ВНЕ функции useMax
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
        onClick: () => {},
        offClick: () => {},
        showProgress: () => {},
        hideProgress: () => {}
    },
    HapticFeedback: {
        impactOccurred: () => {}
    },
    initDataUnsafe: {},
    showAlert: (params) => alert(params.message || 'Alert')
};

// 2. Сама функция хука
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
        user: mx.initDataUnsafe?.user || null,
        queryId: mx.initDataUnsafe?.query_id || null,
        chat: mx.initDataUnsafe?.chat || null,             // Добавлено для App.js
        startParam: mx.initDataUnsafe?.start_param || null // Добавлено для App.js
    };
}