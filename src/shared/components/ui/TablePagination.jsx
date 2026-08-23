import Button from "./Button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const TablePagination = ({
  rangeStart,
  rangeEnd,
  totalItems,
  hasNextPage,
  hasPreviousPage,
  onNext,
  onPrevious,
  isLoading = false,
}) => {
  return (
    <div className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-xs font-medium text-slate-500">
        Showing <span className="font-semibold text-slate-700">{rangeStart}</span> – <span className="font-semibold text-slate-700">{rangeEnd}</span> of <span className="font-semibold text-slate-700">{totalItems}</span> items
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="xs"
          onClick={onPrevious}
          disabled={!hasPreviousPage || isLoading}
        >
          <ChevronLeft size={14} />
          <span>Previous</span>
        </Button>
        <Button
          variant="secondary"
          size="xs"
          onClick={onNext}
          disabled={!hasNextPage || isLoading}
        >
          <span>Next</span>
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  )
}

export default TablePagination

