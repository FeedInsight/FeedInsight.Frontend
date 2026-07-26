import Card from '@shared/components/ui/Card.jsx'

/**
 * Single KPI tile (e.g. "New feedback this week", "Open feature requests",
 * "Avg. urgency score"). Composed multiple times in DashboardPage from
 * fields on the latest DailyAnalyticsSnapshots row -- this component takes
 * pre-computed numbers only, no aggregation logic belongs here.
 */
export default function KpiCard({ label, value, icon: Icon, trend }) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
        {trend && <p className="text-xs text-slate-400">{trend}</p>}
      </div>
      {Icon && <Icon className="text-brand-500" size={28} />}
    </Card>
  )
}
