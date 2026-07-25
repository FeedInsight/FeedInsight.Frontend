/**
 * src/components/adminPortal/dashboard/KpiCard.jsx
 * ----------------------------------------------------------------------------
 * Renders a single KPI (README: "system KPIs using lightning-fast daily data
 * snapshots"), e.g. Total Feedback, Open Stories, Avg Urgency.
 *
 * Props:
 *   - label: string
 *   - value: number | string
 *   - deltaPct: number | undefined — optional trend vs. previous period
 * ----------------------------------------------------------------------------
 */
import React from "react";
import Card from "../../common/Card/Card";
import styles from "./KpiCard.module.css";

export default function KpiCard({ label, value, deltaPct }) {
  return (
    <Card>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
      {typeof deltaPct === "number" && (
        <div className={deltaPct >= 0 ? styles.deltaUp : styles.deltaDown}>
          {deltaPct >= 0 ? "▲" : "▼"} {Math.abs(deltaPct)}%
        </div>
      )}
    </Card>
  );
}
