import { cn } from '@shared/utils/classNames.js'

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={cn('rounded-xl border border-slate-200 bg-white p-4 shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  )
}
