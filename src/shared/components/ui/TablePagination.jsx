import Button from "./Button"

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
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-slate-500">
        Showing {rangeStart} - {rangeEnd} of {totalItems}
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={onPrevious}
          disabled={!hasPreviousPage || isLoading}
        >
          Previous
        </Button>
        <Button
          size="sm"
          onClick={onNext}
          disabled={!hasNextPage || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default TablePagination
