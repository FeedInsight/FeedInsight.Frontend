/**
 * src/pages/admin/DashboardPage.jsx
 * ----------------------------------------------------------------------------
 * Route: /admin/dashboard. Maps to README's "AI Analytics Dashboard".
 *
 * Responsibilities:
 *   - On mount, dispatch loadDashboardSnapshot, loadSentimentTrends (default
 *     range e.g. last 30 days — TODO make range user-adjustable), loadKpis.
 *   - Compose KpiCard (one per entry in state.analytics.kpis),
 *     SentimentChart (state.analytics.sentimentTrends).
 *   - Read status/error from state.analytics for <Loader />/error display.
 * ----------------------------------------------------------------------------
 */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadDashboardSnapshot,
  loadSentimentTrends,
  loadKpis,
} from "../../store/slices/analyticsSlice";
import KpiCard from "../../components/adminPortal/dashboard/KpiCard";
import SentimentChart from "../../components/adminPortal/dashboard/SentimentChart";
import Loader from "../../components/common/Loader/Loader";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { kpis, sentimentTrends, status } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(loadDashboardSnapshot());
    // TODO: replace hardcoded range with a real last-30-days ISO range
    dispatch(loadSentimentTrends({ from: null, to: null }));
    dispatch(loadKpis());
  }, [dispatch]);

  if (status === "loading") return <Loader />;

  return (
    <div>
      <h1>Dashboard</h1>
      <div className={styles.kpiGrid}>
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} deltaPct={kpi.deltaPct} />
        ))}
      </div>
      <SentimentChart data={sentimentTrends} />
    </div>
  );
}
