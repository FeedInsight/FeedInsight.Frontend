import { useState } from 'react'
import { format, subDays } from 'date-fns'
import { MessageSquareText, ListChecks, Gauge } from 'lucide-react'
import KpiCard from '@features/dashboard/components/KpiCard.jsx'
import SentimentTrendChart from '@features/dashboard/components/SentimentTrendChart.jsx'
import FeatureRequestsWidget from '@features/dashboard/components/FeatureRequestsWidget.jsx'
import SnapshotDatePicker from '@features/dashboard/components/SnapshotDatePicker.jsx'
import Spinner from '@shared/components/ui/Spinner.jsx'
import { useDailySnapshots } from '@features/dashboard/hooks/useDailySnapshots.js'

/**
 * "AI Analytics Dashboard" page from the README's Admin Portal section.
 * Composition-only: owns the date range filter state, delegates fetching to
 * useDailySnapshots, and passes derived data down to presentational
 * components. Do not add chart-rendering or KPI math directly here.
 */
export default function DashboardPage() {
  const [range, setRange] = useState({
    from: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd'),
  })

  const { data: snapshots = [], isLoading } = useDailySnapshots(range)

  const latest = snapshots[snapshots.length - 1]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <SnapshotDatePicker range={range} onChange={setRange} />
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <KpiCard label="New feedback (latest day)" value={latest?.newFeedbackCount ?? '—'} icon={MessageSquareText} />
            <KpiCard label="New draft stories (latest day)" value={latest?.newStoriesCount ?? '—'} icon={ListChecks} />
            <KpiCard label="Positive sentiment (latest day)" value={latest?.positiveCount ?? '—'} icon={Gauge} />
          </div>

          <SentimentTrendChart snapshots={snapshots} />
          <FeatureRequestsWidget items={[]} />
        </>
      )}
    </div>
  )
}
