import { useState } from 'react'
import { format, subDays } from 'date-fns'
import { MessageSquareText, FileText, CheckCircle } from 'lucide-react'
import KpiCard from '@features/dashboard/components/KpiCard.jsx'
import SentimentTrendChart from '@features/dashboard/components/SentimentTrendChart.jsx'
import FeatureRequestsWidget from '@features/dashboard/components/FeatureRequestsWidget.jsx'
import SnapshotDatePicker from '@features/dashboard/components/SnapshotDatePicker.jsx'
import Spinner from '@shared/components/ui/Spinner.jsx'
import { useAnalyticsSnapshots, useLatestAnalyticsSnapshot } from '../hooks/useAnalytics'

export default function DashboardPage() {
  const [range, setRange] = useState({
    from: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd'),
  })

  const { data: latest, isLoading: isLoadingLatest } = useLatestAnalyticsSnapshot()
  const { data: snapshots, isLoading: isLoadingSnapshots } = useAnalyticsSnapshots(range)

  const isLoading = isLoadingLatest || isLoadingSnapshots

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
            <KpiCard
              label="New feedback (latest snapshot)"
              value={latest?.totalFeedbacksReceived ?? '—'}
              icon={MessageSquareText}
            />

            <KpiCard
              label="New draft stories (latest snapshot)"
              value={latest?.draftTicketsGenerated ?? '—'}
              icon={FileText}
            />

            <KpiCard
              label="PO Approval Rate (latest snapshot)"
              value={latest?.poApprovalRatePercent + '%' ?? '—'}
              icon={CheckCircle}
            />
          </div>

          <SentimentTrendChart snapshots={snapshots} />
          <FeatureRequestsWidget items={[]} />
        </>
      )}
    </div>
  )
}
