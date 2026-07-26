import Card from '@shared/components/ui/Card.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import { ListChecks } from 'lucide-react'

/**
 * Small "top requested features" widget. Data source TODO: once the
 * backend exposes a top-N endpoint (group UserStories by Category, order by
 * linked ExtractedTasks count), wire it through a dedicated hook in
 * dashboard/hooks -- for now this only defines the presentational shape:
 * `items: Array<{ title: string, requestCount: number }>`.
 */
export default function FeatureRequestsWidget({ items = [] }) {
  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold text-slate-700">Top Requested Features</h3>
      {items.length === 0 ? (
        <EmptyState icon={ListChecks} title="No data yet" description="Feature requests will appear here as feedback comes in." />
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.title} className="flex justify-between text-sm">
              <span className="text-slate-700">{item.title}</span>
              <span className="font-medium text-slate-500">{item.requestCount}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
