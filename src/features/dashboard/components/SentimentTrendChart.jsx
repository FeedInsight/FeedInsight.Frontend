import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { eachDayOfInterval, format, parseISO } from 'date-fns'
import Card from '@shared/components/ui/Card.jsx'
import { ChartColumn } from 'lucide-react'
import EmptyState from '@shared/components/ui/EmptyState'

const EMPTY_DAY = {
  positiveSentimentCount: 0,
  neutralSentimentCount: 0,
  negativeSentimentCount: 0,
}

const chartData = (snapshots, range) => {
  const byDate = Object.fromEntries(
    snapshots.map((s) => [s.snapshotDate, s])
  )

  const allDays = eachDayOfInterval({
    start: parseISO(range.from),
    end: parseISO(range.to),
  })

  return allDays.map((day) => {
    const dateStr = format(day, 'yyyy-MM-dd')
    return { snapshotDate: dateStr, ...EMPTY_DAY, ...byDate[dateStr] }
  })
}

export default function SentimentTrendChart({ snapshots, range }) {
  const chartSnapshots = chartData(snapshots, range)

  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold text-slate-700">Sentiment Trend</h3>
      {chartSnapshots && chartSnapshots?.length > 0 ? (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartSnapshots}>
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
