/**
 * src/api/analyticsApi.js
 * ----------------------------------------------------------------------------
 * Maps to DailyAnalyticsSnapshots — "pre-calculated sentiment trends, feature
 * requests, and system KPIs using lightning-fast daily data snapshots".
 * Consumed by src/store/slices/analyticsSlice.js and
 * src/components/adminPortal/dashboard/*.
 * ----------------------------------------------------------------------------
 */
import axiosClient from "./axiosClient";
import ENDPOINTS from "./endpoints";

/** @returns {Promise<{ totalFeedback, openStories, avgUrgency, sentimentBreakdown }>} */
export function fetchDashboardSnapshot() {
  // TODO: GET ENDPOINTS.ANALYTICS.DASHBOARD_SNAPSHOT
  return axiosClient.get(ENDPOINTS.ANALYTICS.DASHBOARD_SNAPSHOT);
}

/** @param {{ from: string, to: string }} range ISO date strings */
export function fetchSentimentTrends(range) {
  // TODO: GET ENDPOINTS.ANALYTICS.SENTIMENT_TRENDS with query params
  return axiosClient.get(ENDPOINTS.ANALYTICS.SENTIMENT_TRENDS, { params: range });
}

export function fetchKpis() {
  // TODO: GET ENDPOINTS.ANALYTICS.KPIS
  return axiosClient.get(ENDPOINTS.ANALYTICS.KPIS);
}
