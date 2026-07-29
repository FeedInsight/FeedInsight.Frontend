import { forwardRef } from 'react'
import { cn } from '@shared/utils/classNames.js'

/**
 * Base text input, designed to be passed directly to react-hook-form's
 * `register()` via ref forwarding. Always render `error` below the field
 * rather than as a floating tooltip, for accessibility and layout stability.
 *
 * Props: label, error (string), rightElement (ReactNode), plus all native <input> props.
 */
const Input = forwardRef(({ label, error, rightElement, className, id, ...props }, ref) => {
  const errorId = error && id ? `${id}-error` : undefined

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          id={id}
          ref={ref}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn(
            'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-100 disabled:text-slate-500',
            rightElement && 'pr-10',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
            className,
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 flex items-center justify-center text-slate-400 hover:text-slate-600">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <span id={errorId} className="text-xs text-red-600">
          {error}
        </span>
      )}
    </div>
  )
})
Input.displayName = 'Input'
export default Input
