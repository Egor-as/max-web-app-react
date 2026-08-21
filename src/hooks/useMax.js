// ... (твой код с mock остается без изменений до return)

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
        // ДОБАВЛЕНО: чтобы App.js мог их прочитать
        chat: mx.initDataUnsafe?.chat || null,
        startParam: mx.initDataUnsafe?.start_param || null, 
    };
}