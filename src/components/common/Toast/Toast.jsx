/**
 * src/components/common/Toast/Toast.jsx
 * ----------------------------------------------------------------------------
 * Renders a single toast. Purely presentational — receives one toast object
 * and a dismiss callback. Rendered in a loop by ToastContainer.jsx.
 *
 * Props:
 *   - toast: { id, type: 'success'|'error'|'info', message }
 *   - onDismiss: (id) => void
 * ----------------------------------------------------------------------------
 */
import React from "react";
import clsx from "clsx";
import styles from "./Toast.module.css";

export default function Toast({ toast, onDismiss }) {
  return (
    <div className={clsx(styles.toast, styles[toast.type])}>
      <span>{toast.message}</span>
      <button className={styles.dismiss} onClick={() => onDismiss(toast.id)} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
