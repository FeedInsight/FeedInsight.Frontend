import { cn } from '@shared/utils/classNames.js'

export default function Table({ className, children }) {
  return (
    <table
      className={cn(
        'w-full border-collapse rounded-xl bg-white text-left text-sm shadow-lg overflow-hidden dark:bg-slate-900',
        className,
      )}
    >
      {children}
    </table>
  )
}

Table.Head = function TableHead({ children }) {
  return (
    <thead className="border-b border-slate-200 bg-slate-200 text-xs uppercase text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
      {children}
    </thead>
  )
}

Table.Row = function TableRow({ children, className }) {
  return (
    <tr className={cn('border-b border-slate-100 last:border-0 dark:border-slate-800', className)}>
      {children}
    </tr>
  )
}

Table.Cell = function TableCell({ children, className, as: Tag = 'td', ...props }) {
  return (
    <Tag className={cn('px-5 py-3', className)} {...props}>
      {children}
    </Tag>
  )
}
