import Input from '@shared/components/ui/Input.jsx'

/**
 * Simple from/to date range control feeding useDailySnapshots({ from, to }).
 * Kept intentionally basic (two native date inputs) -- swap for a proper
 * range-picker component later without changing the hook's contract.
 */
export default function SnapshotDatePicker({ range, onChange }) {
  return (
    <div className="flex items-end gap-3">
      <Input
        label="From"
        type="date"
        value={range.from}
        onChange={(e) => onChange({ ...range, from: e.target.value })}
      />
      <Input
        label="To"
        type="date"
        value={range.to}
        onChange={(e) => onChange({ ...range, to: e.target.value })}
      />
    </div>
  )
}
