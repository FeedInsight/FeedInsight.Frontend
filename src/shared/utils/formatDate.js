import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'

export function formatDateTime(isoString) {
  if (!isoString) return '—'
  try {
    const date = typeof isoString === 'string' ? parseISO(isoString) : new Date(isoString)
    if (!isValid(date)) return '—'
    return format(date, 'MMM d, yyyy, h:mm a')
  } catch {
    return '—'
  }
}

export function formatRelative(isoString) {
  if (!isoString) return '—'
  try {
    const date = typeof isoString === 'string' ? parseISO(isoString) : new Date(isoString)
    if (!isValid(date)) return '—'
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return '—'
  }
}

