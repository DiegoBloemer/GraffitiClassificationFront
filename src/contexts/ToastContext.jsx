import { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const success = useCallback((message) => addToast('success', message), [addToast]);
  const error = useCallback((message) => addToast('error', message), [addToast]);
  const info = useCallback((message) => addToast('info', message), [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, success, error, info }}>
      {children}
    </ToastContext.Provider>
  );
}
