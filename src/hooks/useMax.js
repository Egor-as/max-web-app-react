const mx = window.WebApp;

export function useMax() {

    const onClose = () => {
        mx.close()
    }

    const onToggleButton = () => {
        if(mx.MainButton.isVisible) {
            mx.MainButton.hide();
        } else {
            mx.MainButton.show();
        }
    }

    return {
        onClose,
        onToggleButton,
        mx,
        user: mx.initDataUnsafe?.user,
        queryId: mx.initDataUnsafe?.query_id,
    }
}