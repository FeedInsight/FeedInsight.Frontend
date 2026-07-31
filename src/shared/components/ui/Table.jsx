import { cn } from '@shared/utils/classNames.js'

export default function Table({ className, children }) {
  return (
    <table
      className={cn(
        'w-full bg-white border-collapse text-left text-sm rounded-xl shadow-lg overflow-hidden',
        className,
      )}
    >
      {children}
    </table>
  )
}

Table.Head = function TableHead({ children }) {
  return (
    <thead className="border-b bg-slate-200 border-slate-200 text-xs uppercase text-slate-500">
      {children}
    </thead>
  )
}

Table.Row = function TableRow({ children, className }) {
  return <tr className={cn('border-b border-slate-100 last:border-0', className)}>{children}</tr>
}

Table.Cell = function TableCell({ children, className, as: Tag = 'td', ...props }) {
  return (
    <Tag className={cn('px-5 py-3', className)} {...props}>
      {children}
    </Tag>
  )
}
