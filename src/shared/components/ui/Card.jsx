import { cn } from '@shared/utils/classNames.js'

/** Generic surface container used for dashboard KPI tiles, story cards,
 * chat panels -- anywhere content needs a bordered/elevated block. */
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
