/**
 * src/store/slices/analyticsSlice.js
 * ----------------------------------------------------------------------------
 * Owns the AI Analytics Dashboard data (DailyAnalyticsSnapshots-derived).
 *
 * State shape:
 *   {
 *     snapshot: { totalFeedback, openStories, avgUrgency, sentimentBreakdown } | null,
 *     sentimentTrends: Array<{ date, positive, neutral, negative }>,
 *     kpis: Array<{ label, value, deltaPct }>,
 *     status: 'idle' | 'loading' | 'succeeded' | 'failed',
 *     error: string | null
 *   }
 *
 * Consumed by:
 *   - src/pages/admin/DashboardPage.jsx (dispatches all three loads on mount)
 *   - src/components/adminPortal/dashboard/SentimentChart.jsx (reads `sentimentTrends`)
 *   - src/components/adminPortal/dashboard/KpiCard.jsx (reads `kpis`)
 * ----------------------------------------------------------------------------
 */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as analyticsApi from "../../api/analyticsApi";

export const loadDashboardSnapshot = createAsyncThunk(
  "analytics/loadSnapshot",
  async () => analyticsApi.fetchDashboardSnapshot()
);

export const loadSentimentTrends = createAsyncThunk(
  "analytics/loadSentimentTrends",
  async (range) => analyticsApi.fetchSentimentTrends(range)
);

export const loadKpis = createAsyncThunk("analytics/loadKpis", async () =>
  analyticsApi.fetchKpis()
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    snapshot: null,
    sentimentTrends: [],
    kpis: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadDashboardSnapshot.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadDashboardSnapshot.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.snapshot = action.payload;
      })
      .addCase(loadDashboardSnapshot.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(loadSentimentTrends.fulfilled, (state, action) => {
        state.sentimentTrends = action.payload;
      })
      .addCase(loadKpis.fulfilled, (state, action) => {
        state.kpis = action.payload;
      });
  },
});

export default analyticsSlice.reducer;
