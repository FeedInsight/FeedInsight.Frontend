import { cn } from '@shared/utils/classNames.js'
import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-sm shadow-brand-500/20 hover:shadow-md hover:shadow-brand-500/30 disabled:from-brand-300 disabled:to-indigo-300 disabled:shadow-none',
  secondary:
    'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 shadow-xs disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:border-slate-600 dark:hover:text-white dark:disabled:bg-slate-800 dark:disabled:text-slate-500 dark:disabled:border-slate-700',
  danger:
    'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-sm shadow-red-500/20 hover:shadow-md hover:shadow-red-500/30 disabled:from-red-300 disabled:to-rose-300 disabled:shadow-none',
  success:
    'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm shadow-emerald-500/20 hover:shadow-md hover:shadow-emerald-500/30 disabled:from-emerald-300 disabled:to-teal-300 disabled:shadow-none',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 disabled:text-slate-300 disabled:hover:bg-transparent dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white dark:disabled:text-slate-600',
  outline:
    'bg-brand-50/70 text-brand-700 border border-brand-200 shadow-xs hover:bg-brand-100 hover:border-brand-300 hover:text-brand-800 hover:shadow-sm disabled:bg-slate-50 disabled:text-slate-300 disabled:border-slate-200 dark:bg-brand-950/50 dark:text-brand-300 dark:border-brand-800 dark:hover:bg-brand-900/70 dark:hover:border-brand-700 dark:hover:text-brand-200 dark:disabled:bg-slate-900 dark:disabled:text-slate-600 dark:disabled:border-slate-700',
  subtle:
    'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900 disabled:bg-slate-50 disabled:text-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white dark:disabled:bg-slate-900 dark:disabled:text-slate-600',
  filter:
    'border border-slate-200 bg-slate-50 text-slate-600 shadow-xs hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white dark:hover:border-slate-600',
}

const SIZES = {
  xs: 'px-2 py-1 text-xs rounded-lg gap-1.5 font-medium',
  sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5 font-medium',
  md: 'px-4 py-2 text-sm rounded-xl gap-2 font-medium',
  lg: 'px-5 py-2.5 text-base rounded-xl gap-2.5 font-semibold',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  className,
  children,
  disabled,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center select-none transition-all duration-200 ease-out active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2
            size={size === 'xs' || size === 'sm' ? 14 : 16}
            className="animate-spin shrink-0"
          />
          <span>{loadingText ?? children ?? 'Please wait…'}</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
