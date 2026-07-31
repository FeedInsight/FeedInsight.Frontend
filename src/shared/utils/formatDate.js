import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function formatDateTime(isoString) {
  if (!isoString) return '—'
  return format(parseISO(isoString), 'MMM d, yyyy, h:mm a')
}

export function formatRelative(isoString) {
  if (!isoString) return '—'
  return formatDistanceToNow(parseISO(isoString), { addSuffix: true })
}
