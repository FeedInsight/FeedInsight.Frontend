import { format } from 'date-fns'

export default function SnapshotDatePicker({ range, onChange }) {
  const inputClass =
    'rounded-lg border border-slate-300 px-2 py-1 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100'

  return (
    <div className="flex items-end gap-3">
      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-500">From</label>
        <input
          type="date"
          value={range.from}
          max={range.to}
          onChange={(e) => onChange({ ...range, from: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-500">To</label>
        <input
          type="date"
          value={range.to}
          max={format(new Date(), 'yyyy-MM-dd')}
          onChange={(e) => onChange({ ...range, to: e.target.value })}
          className={inputClass}
        />
      </div>
    </div>
  )
}
