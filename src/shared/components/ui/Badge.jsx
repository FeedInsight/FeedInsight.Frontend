import { cn } from '@shared/utils/classNames.js'

/** Small pill used for story status (see shared/constants/statusEnums.js),
 * sentiment, and urgency indicators. Pass a pre-resolved `className` for
 * color -- this component only handles shape/typography. */
export default function Badge({ className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        className,
      )}
    >
      {children}
    </span>
  )
}
