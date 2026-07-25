/**
 * src/components/common/Badge/Badge.jsx
 * ----------------------------------------------------------------------------
 * Small colored label. Used for: Story status (Draft/Approved/Rejected),
 * Sentiment (Positive/Neutral/Negative), Urgency label, Category tag.
 *
 * Props:
 *   - tone: 'neutral' | 'success' | 'warning' | 'danger' | 'info' (default 'neutral')
 *   - children: ReactNode
 * ----------------------------------------------------------------------------
 */
import React from "react";
import clsx from "clsx";
import styles from "./Badge.module.css";

export default function Badge({ tone = "neutral", children }) {
  return <span className={clsx(styles.badge, styles[tone])}>{children}</span>;
}
