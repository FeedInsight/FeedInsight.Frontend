/**
 * src/context/ToastContext.jsx
 * ----------------------------------------------------------------------------
 * Global toast/notification queue. Any layer (components, hooks, even axios
 * interceptors indirectly via a subscribed listener) can push a toast.
 *
 * Provides via useToast():
 *   - showToast({ type: 'success'|'error'|'info', message: string }): void
 *   - dismissToast(id): void
 *   - toasts: Array<{ id, type, message }>   (read by ToastContainer only)
 *
 * Rendering lives in src/components/common/Toast/ToastContainer.jsx, mounted
 * once in src/App.jsx — this file owns state/queue logic only, no JSX beyond
 * the provider wrapper.
 * ----------------------------------------------------------------------------
 */
import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(undefined);
let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = "info", message, durationMs = 4000 }) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, type, message }]);
      // TODO: consider pausing auto-dismiss on hover (implement in ToastContainer)
      setTimeout(() => dismissToast(id), durationMs);
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (ctx === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
