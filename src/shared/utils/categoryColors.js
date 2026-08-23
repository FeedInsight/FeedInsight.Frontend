/**
 * Dynamic color themes and resolution helpers for Category badges across the application.
 * Satisfies Category Badges on AI Triage Inbox, Extracted Tasks, and Customer Feedbacks.
 * Ensures categories added by ANY Product Owner are styled with vibrant, distinct visual themes.
 */

const PALETTE = [
  {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200/80',
    dot: 'bg-indigo-500',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
  },
  {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200/80',
    dot: 'bg-emerald-500',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  },
  {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200/80',
    dot: 'bg-amber-500',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
  },
  {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200/80',
    dot: 'bg-rose-500',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
  },
  {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200/80',
    dot: 'bg-cyan-500',
    badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
  },
  {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200/80',
    dot: 'bg-purple-500',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200/80',
  },
  {
    bg: 'bg-fuchsia-50',
    text: 'text-fuchsia-700',
    border: 'border-fuchsia-200/80',
    dot: 'bg-fuchsia-500',
    badgeClass: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/80',
  },
  {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200/80',
    dot: 'bg-teal-500',
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-200/80',
  },
  {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200/80',
    dot: 'bg-blue-500',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/80',
  },
  {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200/80',
    dot: 'bg-violet-500',
    badgeClass: 'bg-violet-50 text-violet-700 border-violet-200/80',
  },
]

function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

/**
 * Returns dynamic color theme for any category name (default or custom).
 * @param {string} categoryName
 * @returns {{ bg: string, text: string, border: string, dot: string, badgeClass: string }}
 */
export function getCategoryTheme(categoryName = '') {
  const name = String(categoryName || '').toLowerCase().trim()

  if (!name || name.includes('uncategorized') || name === 'none' || name === 'unknown') {
    return {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200/80',
      dot: 'bg-slate-400',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200/80',
    }
  }

  // Bugs & Defects
  if (
    name.includes('bug') ||
    name.includes('defect') ||
    name.includes('fix') ||
    name.includes('error') ||
    name.includes('issue') ||
    name.includes('crash')
  ) {
    return {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200/80',
      dot: 'bg-rose-500',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
    }
  }

  // Features & Improvements
  if (
    name.includes('feature') ||
    name.includes('enhancement') ||
    name.includes('request') ||
    name.includes('idea')
  ) {
    return {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200/80',
      dot: 'bg-indigo-500',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    }
  }

  // Performance & Speed
  if (
    name.includes('perf') ||
    name.includes('speed') ||
    name.includes('optimiz') ||
    name.includes('latency') ||
    name.includes('slow') ||
    name.includes('memory')
  ) {
    return {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200/80',
      dot: 'bg-amber-500',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
    }
  }

  // UI / UX / Frontend
  if (
    name.includes('ui') ||
    name.includes('ux') ||
    name.includes('design') ||
    name.includes('style') ||
    name.includes('layout') ||
    name.includes('mobile')
  ) {
    return {
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
      border: 'border-cyan-200/80',
      dot: 'bg-cyan-500',
      badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
    }
  }

  // Security & Auth
  if (
    name.includes('sec') ||
    name.includes('auth') ||
    name.includes('login') ||
    name.includes('permission') ||
    name.includes('privacy') ||
    name.includes('token')
  ) {
    return {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200/80',
      dot: 'bg-emerald-500',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    }
  }

  // Data & Database
  if (
    name.includes('data') ||
    name.includes('db') ||
    name.includes('sql') ||
    name.includes('migration') ||
    name.includes('storage')
  ) {
    return {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200/80',
      dot: 'bg-blue-500',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/80',
    }
  }

  // Integrations & APIs
  if (
    name.includes('integ') ||
    name.includes('api') ||
    name.includes('webhook') ||
    name.includes('jira') ||
    name.includes('connect')
  ) {
    return {
      bg: 'bg-fuchsia-50',
      text: 'text-fuchsia-700',
      border: 'border-fuchsia-200/80',
      dot: 'bg-fuchsia-500',
      badgeClass: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/80',
    }
  }

  // Billing & Subscriptions
  if (
    name.includes('bill') ||
    name.includes('pay') ||
    name.includes('price') ||
    name.includes('invoice') ||
    name.includes('subscription')
  ) {
    return {
      bg: 'bg-violet-50',
      text: 'text-violet-700',
      border: 'border-violet-200/80',
      dot: 'bg-violet-500',
      badgeClass: 'bg-violet-50 text-violet-700 border-violet-200/80',
    }
  }

  // Deterministic palette selection for arbitrary custom categories added by Product Owner
  const index = hashString(name) % PALETTE.length
  return PALETTE[index]
}

/**
 * Resolves the category name from a feedback item or extracted task,
 * checking all naming variants, nested category objects, and categoryId lookup maps.
 * @param {any} entity - Feedback item or ExtractedTask object
 * @param {Record<string, string>} [categoriesMap] - Optional map of categoryId -> categoryName
 * @returns {string}
 */
export function resolveCategoryName(entity, categoriesMap = {}) {
  if (!entity) return 'Uncategorized'

  if (typeof entity === 'string' && entity.trim()) {
    return entity.trim()
  }

  if (typeof entity === 'object') {
    // 1. Direct name properties
    if (typeof entity.name === 'string' && entity.name.trim()) return entity.name.trim()
    if (typeof entity.categoryName === 'string' && entity.categoryName.trim()) return entity.categoryName.trim()
    if (typeof entity.categoryTitle === 'string' && entity.categoryTitle.trim()) return entity.categoryTitle.trim()
    if (typeof entity.CategoryName === 'string' && entity.CategoryName.trim()) return entity.CategoryName.trim()
    if (typeof entity.CategoryTitle === 'string' && entity.CategoryTitle.trim()) return entity.CategoryTitle.trim()

    // 2. String category property
    if (typeof entity.category === 'string' && entity.category.trim()) return entity.category.trim()
    if (typeof entity.Category === 'string' && entity.Category.trim()) return entity.Category.trim()

    // 3. Nested category object
    if (entity.category && typeof entity.category === 'object') {
      if (typeof entity.category.name === 'string' && entity.category.name.trim()) return entity.category.name.trim()
      if (typeof entity.category.title === 'string' && entity.category.title.trim()) return entity.category.title.trim()
    }
    if (entity.Category && typeof entity.Category === 'object') {
      if (typeof entity.Category.Name === 'string' && entity.Category.Name.trim()) return entity.Category.Name.trim()
      if (typeof entity.Category.name === 'string' && entity.Category.name.trim()) return entity.Category.name.trim()
    }

    // 4. ID lookup against tenant categories
    const catId =
      entity.categoryId ||
      entity.CategoryId ||
      entity.targetCategoryId ||
      entity.TargetCategoryId ||
      (entity.category && entity.category.id) ||
      (entity.Category && entity.Category.id)

    if (catId && categoriesMap && categoriesMap[catId]) {
      return categoriesMap[catId]
    }

    // 5. Metadata JSON parsing
    if (entity.metadataJson || entity.MetadataJson) {
      try {
        const meta =
          typeof entity.metadataJson === 'string'
            ? JSON.parse(entity.metadataJson)
            : entity.metadataJson || entity.MetadataJson
        if (meta && typeof meta.category === 'string' && meta.category.trim()) {
          return meta.category.trim()
        }
      } catch {
        // ignore
      }
    }

    // 6. Inherit from extracted tasks if parent feedback is missing explicit category
    const rawTasks = entity.extractedTasks || entity.tasks || entity.$values
    const tasks = Array.isArray(rawTasks)
      ? rawTasks
      : Array.isArray(rawTasks?.items)
      ? rawTasks.items
      : []

    if (tasks.length > 0) {
      for (const t of tasks) {
        const taskCat = resolveCategoryName(t, categoriesMap)
        if (taskCat && taskCat.toLowerCase() !== 'uncategorized' && taskCat.toLowerCase() !== 'general') {
          return taskCat
        }
      }
    }
  }

  return 'Uncategorized'
}

/**
 * Extracts all unique category names present across a feedback item and its extracted tasks.
 * @param {any} item
 * @param {Record<string, string>} [categoriesMap]
 * @returns {string[]}
 */
export function extractAllCategoryNames(item, categoriesMap = {}) {
  if (!item) return ['Uncategorized']

  const rawTasks = item.extractedTasks ?? item.tasks ?? item.$values
  const extractedList = Array.isArray(rawTasks)
    ? rawTasks
    : Array.isArray(rawTasks?.items)
    ? rawTasks.items
    : []

  const itemCat = resolveCategoryName(item, categoriesMap)
  const taskCats = extractedList.map((t) => resolveCategoryName(t, categoriesMap))

  const unique = Array.from(new Set([itemCat, ...taskCats].filter(Boolean)))
  const valid = unique.filter((c) => c && c.toLowerCase() !== 'uncategorized')

  return valid.length > 0 ? valid : ['Uncategorized']
}
