/**
 * src/components/adminPortal/dashboard/TrendGraph.jsx
 * ----------------------------------------------------------------------------
 * Generic small trend sparkline/bar chart, reusable for any single-metric
 * time series on the dashboard beyond sentiment (e.g. feedback volume/day,
 * stories created/day). Kept separate from SentimentChart which is
 * multi-series and sentiment-specific.
 *
 * Props:
 *   - data: Array<{ date: string, value: number }>
 *   - label: string
 * ----------------------------------------------------------------------------
 */
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import Card from "../../common/Card/Card";

export default function TrendGraph({ data, label }) {
  return (
    <Card title={label}>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data}>
          <XAxis dataKey="date" hide />
          <Tooltip />
          <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
