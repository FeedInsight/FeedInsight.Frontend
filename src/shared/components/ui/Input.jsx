import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@shared/utils/classNames.js'

const Input = forwardRef(({ label, error, rightElement, className, id, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = props.type === 'password'
  const inputId = id ?? props.name
  const errorId = error && inputId ? `${inputId}-error` : undefined

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          id={inputId}
          ref={ref}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          {...props}
          type={isPassword && showPassword ? 'text' : props.type}
          className={cn(
            'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-brand-950 dark:disabled:bg-slate-800 dark:disabled:text-slate-500',
            (rightElement || isPassword) && 'pr-10',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
            className,
          )}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        ) : rightElement ? (
          <div className="absolute right-3 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            {rightElement}
          </div>
        ) : null}
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
