/**
 * src/components/common/Card/Card.jsx
 * ----------------------------------------------------------------------------
 * Generic surface container with padding + border, used as the base wrapper
 * for KpiCard, StoryCard, and any dashboard panel.
 *
 * Props:
 *   - title: string (optional header)
 *   - actions: ReactNode (optional, rendered top-right of header)
 *   - children: ReactNode
 * ----------------------------------------------------------------------------
 */
import React from "react";
import styles from "./Card.module.css";

export default function Card({ title, actions, children }) {
  return (
    <div className={styles.card}>
      {(title || actions) && (
        <div className={styles.header}>
          {title && <h4 className={styles.title}>{title}</h4>}
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}
      <div className={styles.body}>{children}</div>
    </div>
  );
}
