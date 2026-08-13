import Badge from '@shared/components/ui/Badge.jsx'
import { cn } from '@shared/utils/classNames.js'

export default function UrgencyBadge({ score }) {
  const tier = score >= 4 ? 'high' : score >= 2 ? 'medium' : 'low'
  const styles = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-slate-100 text-slate-600',
  }
  return <Badge className={cn(styles[tier])}>Urgency {score}</Badge>
}
