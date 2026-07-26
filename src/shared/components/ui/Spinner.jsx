import { Loader2 } from 'lucide-react'
import { cn } from '@shared/utils/classNames.js'

/** Used for every isLoading branch across pages/hooks -- do not build
 * one-off inline spinners. */
export default function Spinner({ className, size = 20 }) {
  return <Loader2 className={cn('animate-spin text-brand-600', className)} size={size} />
}
