import { cn } from '@shared/utils/classNames.js'

/**
 * Minimal composable table primitives (Table, Table.Head, Table.Row,
 * Table.Cell) used by AdminUsersTable, CategoryList, and any other tabular
 * list. Feature components own their own column definitions and data
 * mapping -- this file only standardizes markup/spacing/borders.
 */
export default function Table({ className, children }) {
  return (
    <table className={cn('w-full border-collapse text-left text-sm', className)}>{children}</table>
  )
}

Table.Head = function TableHead({ children }) {
  return <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">{children}</thead>
}

Table.Row = function TableRow({ children, className }) {
  return <tr className={cn('border-b border-slate-100 last:border-0', className)}>{children}</tr>
}

Table.Cell = function TableCell({ children, className, as: Tag = 'td' }) {
  return <Tag className={cn('px-3 py-2.5', className)}>{children}</Tag>
}
