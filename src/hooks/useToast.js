import { useState, useCallback } from 'react';

export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 5000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type, duration }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return {
        toasts,
        addToast,
        removeToast,
        showSuccess: useCallback((message, duration) => addToast(message, 'success', duration), [addToast]),
        showError: useCallback((message, duration) => addToast(message, 'error', duration), [addToast]),
    };
};
