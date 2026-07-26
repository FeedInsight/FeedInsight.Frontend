import { cn } from '@shared/utils/classNames.js'

/**
 * Base button used everywhere in both portals. Only extend this component's
 * `variant`/`size` maps for new visual styles -- do not create parallel
 * one-off `<button className="...">` elements in feature components.
 *
 * Props:
 *  - variant: 'primary' | 'secondary' | 'danger' | 'ghost'
 *  - size: 'sm' | 'md' | 'lg'
 *  - isLoading: boolean -> disables button and shows inline spinner text
 */
const VARIANTS = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 disabled:bg-brand-300',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
}

const SIZES = {
  sm: 'px-2.5 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Please wait…' : children}
    </button>
  )
}
