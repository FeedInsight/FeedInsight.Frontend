/**
 * Returns dynamic color themes for Category badges across the application.
 * Satisfies Task #101 (Category Badges on Triage Inbox) with rich visual distinction.
 * 
 * @param {string} categoryName 
 * @returns {{ bg: string, text: string, border: string, dot: string, badgeClass: string }}
 */
export function getCategoryTheme(categoryName = '') {
  const name = String(categoryName || '').toLowerCase().trim()

  if (name.includes('bug') || name.includes('defect') || name.includes('fix') || name.includes('error') || name.includes('issue')) {
    return {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200/80',
      dot: 'bg-rose-500',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
    }
  }

  if (name.includes('feature') || name.includes('enhancement') || name.includes('request') || name.includes('idea')) {
    return {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200/80',
      dot: 'bg-indigo-500',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    }
  }

  if (name.includes('perf') || name.includes('speed') || name.includes('optimiz') || name.includes('latency') || name.includes('slow')) {
    return {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200/80',
      dot: 'bg-amber-500',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
    }
  }

  if (name.includes('ui') || name.includes('ux') || name.includes('design') || name.includes('style') || name.includes('layout')) {
    return {
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
      border: 'border-cyan-200/80',
      dot: 'bg-cyan-500',
      badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
    }
  }

  if (name.includes('sec') || name.includes('auth') || name.includes('login') || name.includes('permission') || name.includes('privacy')) {
    return {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200/80',
      dot: 'bg-emerald-500',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    }
  }

  if (name.includes('data') || name.includes('db') || name.includes('sql') || name.includes('migration')) {
    return {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200/80',
      dot: 'bg-blue-500',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/80',
    }
  }

  return {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200/80',
    dot: 'bg-violet-500',
    badgeClass: 'bg-violet-50 text-violet-700 border-violet-200/80',
  }
}
