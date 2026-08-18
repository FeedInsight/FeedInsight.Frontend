import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import Card from '@shared/components/ui/Card.jsx'
import { ChartColumn } from 'lucide-react'
import EmptyState from '@shared/components/ui/EmptyState'

export default function SentimentTrendChart({ snapshots }) {
  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold text-slate-700">Sentiment Trend</h3>
      {snapshots && snapshots.length > 0 ? (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={snapshots}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="snapshotDate" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="positiveSentimentCount"
              name="Positive Sentiment"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="neutralSentimentCount"
              name="Neutral Sentiment"
              stroke="#94a3b8"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="negativeSentimentCount"
              name="Negative Sentiment"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
            
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <EmptyState icon={ChartColumn} title="No data yet" description="Sentiment trend will appear here" />
      )}
    </Card>
  )
}
