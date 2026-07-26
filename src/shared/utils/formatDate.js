import { format, formatDistanceToNow, parseISO } from 'date-fns'

/** Absolute display date, e.g. "Jul 26, 2026, 3:45 PM". Used in tables
 * (BacklogReviewPage, AdminUsersTable) where scanability matters more than
 * relative time. */
export function formatDateTime(isoString) {
  if (!isoString) return '—'
  return format(parseISO(isoString), 'MMM d, yyyy, h:mm a')
}

/** Relative display, e.g. "3 hours ago". Used in ChatWindow message
 * timestamps and CustomerFeedbacks activity feeds. */
export function formatRelative(isoString) {
  if (!isoString) return '—'
  return formatDistanceToNow(parseISO(isoString), { addSuffix: true })
}
