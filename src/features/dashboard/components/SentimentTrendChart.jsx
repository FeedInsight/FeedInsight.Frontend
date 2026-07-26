import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import Card from '@shared/components/ui/Card.jsx'

/**
 * Renders positive/neutral/negative sentiment counts over time from
 * useDailySnapshots data. Expects `snapshots` shaped as documented in
 * dashboard/api/analyticsApi.js.
 */
export default function SentimentTrendChart({ snapshots = [] }) {
  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold text-slate-700">Sentiment Trend</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={snapshots}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="positiveCount" stroke="#22c55e" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="neutralCount" stroke="#94a3b8" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="negativeCount" stroke="#ef4444" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
