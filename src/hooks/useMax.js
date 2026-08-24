// src/hooks/useMax.js
// Финальная стабильная версия

const mx = window.WebApp || {
    ready: () => {},
    expand: () => {},
    close: () => { window.close(); },
    MainButton: { show: () => {}, hide: () => {}, isVisible: false, setParams: () => {}, onClick: () => {}, offClick: () => {} },
    HapticFeedback: { impactOccurred: () => {}, notificationOccurred: () => {} },
    initDataUnsafe: {},
    showAlert: (params) => alert(params.message || 'Alert')
};

export function useMax() {
    const user = mx.initDataUnsafe?.user || null;
    const queryId = mx.initDataUnsafe?.query_id || null;
    
    const onClose = () => {
        if (mx?.close) mx.close();
    };

    return {
        onClose,
        mx,
        user,       // Будет null, если Max не передал данные (и это нормально)
        queryId,    // Будет null, если Max не передал данные
        isInsideMax: !!window.WebApp,
    };
}