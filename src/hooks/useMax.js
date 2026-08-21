// Безопасно получаем объект. Если приложения нет в окне (обычный браузер),
// создаем безопасную заглушку (mock), чтобы код не падал с ошибкой.
const mx = window.WebApp || {
    ready: () => console.warn('Mock: ready()'),
    expand: () => console.warn('Mock: expand()'),
    close: () => {
        console.warn('Mock: close() called');
        window.close(); // Попытка закрыть вкладку в браузере
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
    showAlert: (params) => alert(params.message || 'Alert') // Fallback для браузера
};

export function useMax() {
    const onClose = () => {
        if (mx?.close) {
            mx.close();
        }
    };

    const onToggleButton = () => {
        // Безопасная проверка перед обращением к свойствам
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
        // Возвращаем null, если данных нет, чтобы компоненты могли корректно отрендерить fallback
        user: mx.initDataUnsafe?.user || null,
        queryId: mx.initDataUnsafe?.query_id || null,
    };
}