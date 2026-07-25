/**
 * src/components/common/Loader/Loader.jsx
 * ----------------------------------------------------------------------------
 * Generic loading indicator.
 *
 * Props:
 *   - fullPage: boolean — centers within the full viewport (used by
 *     ProtectedRoute while auth is rehydrating)
 *   - label: string — optional accessible/visible loading message
 * ----------------------------------------------------------------------------
 */
import React from "react";
import clsx from "clsx";
import styles from "./Loader.module.css";

export default function Loader({ fullPage = false, label = "Loading…" }) {
  return (
    <div className={clsx(styles.wrapper, fullPage && styles.fullPage)} role="status">
      {/* TODO: replace with an actual spinner graphic/animation */}
      <div className={styles.spinner} />
      <span className={styles.label}>{label}</span>
    </div>
  );
}
