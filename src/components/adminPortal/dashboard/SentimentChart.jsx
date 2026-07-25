/**
 * src/components/adminPortal/dashboard/SentimentChart.jsx
 * ----------------------------------------------------------------------------
 * Renders the sentiment trend line/area chart using `recharts`, fed by
 * state.analytics.sentimentTrends (see storiesSlice... actually
 * analyticsSlice — loadSentimentTrends thunk).
 *
 * Props:
 *   - data: Array<{ date: string, positive: number, neutral: number, negative: number }>
 * ----------------------------------------------------------------------------
 */
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Card from "../../common/Card/Card";

export default function SentimentChart({ data }) {
  return (
    <Card title="Sentiment Trends">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* TODO: pull stroke colors from CSS variables via getComputedStyle,
              or define a small JS color map mirroring variables.css */}
          <Line type="monotone" dataKey="positive" stroke="#16A34A" />
          <Line type="monotone" dataKey="neutral" stroke="#94A3B8" />
          <Line type="monotone" dataKey="negative" stroke="#DC2626" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
