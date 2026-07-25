/**
 * src/components/common/Toast/ToastContainer.jsx
 * ----------------------------------------------------------------------------
 * Mounted ONCE in src/App.jsx. Reads the toast queue from ToastContext and
 * renders a stacked list of <Toast /> in a fixed-position corner.
 * ----------------------------------------------------------------------------
 */
import React from "react";
import { useToast } from "../../../context/ToastContext";
import Toast from "./Toast";
import styles from "./Toast.module.css";

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
}
