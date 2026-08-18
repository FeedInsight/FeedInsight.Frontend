import Card from '@shared/components/ui/Card.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import { ListChecks } from 'lucide-react'

export default function FeatureRequestsWidget({ items }) {

  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold text-slate-700">Top Requested Features</h3>
      {!items || items?.length === 0 ? (
        <EmptyState icon={ListChecks} title="No data yet" description="Feature requests will appear here as feedback comes in." />
      ) : (
        <ul className="flex flex-col gap-2">
          {items?.map((item) => (
            <li key={item.Feature} className="flex justify-between text-sm">
              <span className="text-slate-700">{item.Feature}</span>
              <span className="font-medium text-slate-500">{item.Count}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
