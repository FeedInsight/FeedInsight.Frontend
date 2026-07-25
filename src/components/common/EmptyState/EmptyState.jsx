/**
 * src/components/common/EmptyState/EmptyState.jsx
 * ----------------------------------------------------------------------------
 * Shown whenever a list/table has zero rows (no categories yet, no stories
 * matching filters, no chat sessions yet).
 *
 * Props:
 *   - message: string
 *   - action: ReactNode (optional CTA button, e.g. "Create your first category")
 * ----------------------------------------------------------------------------
 */
import React from "react";
import styles from "./EmptyState.module.css";

export default function EmptyState({ message, action }) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.message}>{message}</p>
      {action}
    </div>
  );
}
