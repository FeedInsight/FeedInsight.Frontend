const PageHeader = ({ title, description, children }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h1>

        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="flex items-center gap-3 shrink-0">{children}</div>
      )}
    </div>
  )
}

export default PageHeader