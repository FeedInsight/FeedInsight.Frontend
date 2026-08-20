import { cn } from '@shared/utils/classNames.js'

export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-2 py-12 text-center', className)}
    >
      {Icon && <Icon className="mb-2 text-slate-300" size={40} />}
      <p className="font-medium text-slate-700 dark:text-slate-300">{title}</p>
      {description && <p className="max-w-sm text-sm text-slate-500">{description}</p>}
      {action}
    </div>
  )
}
