/**
 * Comprehensive normalizer and parser for Feedback items and Product Owner comments.
 * Handles single/double JSON stringified metadata, multiple comment arrays,
 * and ensures Product Owner comments/responses are always classified with verified Product Owner status.
 */

export function parseMetadata(metadataJson) {
  if (!metadataJson) return {}
  if (typeof metadataJson === 'object') return metadataJson
  if (typeof metadataJson === 'string') {
    try {
      const parsed = JSON.parse(metadataJson)
      if (typeof parsed === 'string') {
        try {
          return JSON.parse(parsed) || {}
        } catch {
          return { raw: parsed }
        }
      }
      return parsed || {}
    } catch {
      return {}
    }
  }
  return {}
}

export function extractFeedbackComments(item) {
  if (!item) return []

  const rawPOComments = Array.isArray(item.productOwnerComments)
    ? item.productOwnerComments
    : Array.isArray(item.ProductOwnerComments)
    ? item.ProductOwnerComments
    : Array.isArray(item.productOwnerComments?.$values)
    ? item.productOwnerComments.$values
    : Array.isArray(item.ProductOwnerComments?.$values)
    ? item.ProductOwnerComments.$values
    : []

  const rawOtherComments = Array.isArray(item.comments)
    ? item.comments
    : Array.isArray(item.Comments)
    ? item.Comments
    : Array.isArray(item.comments?.$values)
    ? item.comments.$values
    : Array.isArray(item.feedbackComments)
    ? item.feedbackComments
    : Array.isArray(item.FeedbackComments)
    ? item.FeedbackComments
    : Array.isArray(item.replies)
    ? item.replies
    : Array.isArray(item.Replies)
    ? item.Replies
    : []

  const combined = [
    ...rawPOComments.map((c) => ({ ...c, _isFromPOArray: true })),
    ...rawOtherComments.map((c) => ({ ...c, _isFromPOArray: false })),
  ]

  const seenIds = new Set()
  const unique = []
  for (const c of combined) {
    const commentId = c.id || c.Id || c.commentId || c.CommentId
    if (commentId) {
      if (seenIds.has(commentId)) continue
      seenIds.add(commentId)
    }
    unique.push(c)
  }

  return unique.map((c) => {
    const roleStr = String(
      c.role || c.Role || c.userRole || c.authorRole || c.type || '',
    ).toLowerCase()
    const isExplicitCustomer =
      roleStr === 'customer' ||
      roleStr === 'companycustomer' ||
      roleStr === 'client'

    // In feedback tickets, comments added by product team / tenant owners are Product Owner responses
    const isPO =
      !isExplicitCustomer ||
      c._isFromPOArray === true ||
      Boolean(c.isCompany) ||
      Boolean(c.isProductOwner) ||
      roleStr.includes('owner') ||
      roleStr.includes('admin') ||
      roleStr.includes('team')

    const authorName =
      c.author ||
      c.Author ||
      c.authorName ||
      c.AuthorName ||
      c.createdByName ||
      c.CreatedByName ||
      (c.user
        ? `${c.user.firstName || ''} ${c.user.lastName || ''}`.trim()
        : null) ||
      (isPO ? 'Product Owner' : 'Customer')

    return {
      id: c.id || c.Id || c.commentId || c.CommentId,
      userId: c.userId || c.UserId,
      content:
        c.content ||
        c.Content ||
        c.message ||
        c.Message ||
        c.text ||
        c.Text ||
        c.comment ||
        c.Comment ||
        c.body ||
        c.Body ||
        '',
      author: authorName,
      role: isPO ? 'ProductOwner' : 'Customer',
      isProductOwner: isPO,
      createdAt:
        c.createdAt ||
        c.CreatedAt ||
        c.createdDate ||
        c.CreatedDate ||
        c.timestamp ||
        c.date ||
        null,
    }
  })
}

export function normalizeFeedbackItem(item) {
  if (!item || typeof item !== 'object') return null
  const meta = parseMetadata(item.metadataJson || item.MetadataJson || item.metadata)
  const comments = extractFeedbackComments(item)

  const rawText =
    item.rawContent ||
    item.RawContent ||
    item.content ||
    item.Content ||
    item.description ||
    item.Description ||
    item.message ||
    item.Message ||
    ''

  const title =
    item.title ||
    item.Title ||
    meta.title ||
    meta.Title ||
    meta.subject ||
    meta.Subject ||
    (rawText
      ? rawText.length > 60
        ? rawText.slice(0, 60).trim() + '...'
        : rawText
      : 'Customer Feedback')

  const content = rawText || 'No content provided'

  const category =
    item.category ||
    item.Category ||
    meta.category ||
    meta.Category ||
    item.categoryName ||
    item.CategoryName ||
    item.category?.name ||
    'General'

  const overallSentiment =
    item.overallSentiment ||
    item.OverallSentiment ||
    item.sentiment ||
    item.Sentiment ||
    meta.sentiment ||
    meta.overallSentiment ||
    null

  const isProcessedByRouter = Boolean(
    item.isProcessedByRouter ??
    item.IsProcessedByRouter ??
    item.processedByRouter ??
    meta.isProcessedByRouter,
  )

  const submitterEmail =
    item.submitterEmail ||
    item.SubmitterEmail ||
    item.customerEmail ||
    item.CustomerEmail ||
    item.email ||
    item.Email ||
    meta.email ||
    meta.submitterEmail ||
    null

  const submitterName =
    item.submitterName ||
    item.SubmitterName ||
    item.customerName ||
    item.CustomerName ||
    (item.customer
      ? `${item.customer.firstName || ''} ${item.customer.lastName || ''}`.trim()
      : null) ||
    item.firstName ||
    'Customer'

  const submittedAt =
    item.createdAt ||
    item.CreatedAt ||
    item.submissionDate ||
    item.SubmissionDate ||
    item.submittedAt ||
    item.SubmittedAt ||
    meta.submittedAt ||
    meta.createdAt ||
    null

  return {
    id: item.id || item.Id || item.feedbackId || item.FeedbackId || item.customerFeedbackId,
    title,
    content,
    category,
    overallSentiment,
    isProcessedByRouter,
    submitterEmail,
    submitterName,
    submittedAt,
    status: item.status || item.Status || item.feedbackStatus || null,
    comments,
    metadata: meta,
  }
}

export function normalizeFeedbackList(rawData) {
  if (!rawData) return []
  let items = []

  if (Array.isArray(rawData)) {
    items = rawData
  } else if (Array.isArray(rawData?.data)) {
    items = rawData.data
  } else if (Array.isArray(rawData?.data?.items)) {
    items = rawData.data.items
  } else if (Array.isArray(rawData?.data?.$values)) {
    items = rawData.data.$values
  } else if (Array.isArray(rawData?.data?.data)) {
    items = rawData.data.data
  } else if (Array.isArray(rawData?.items)) {
    items = rawData.items
  } else if (Array.isArray(rawData?.$values)) {
    items = rawData.$values
  } else if (
    typeof rawData === 'object' &&
    (rawData.id || rawData.Id || rawData.rawContent || rawData.content)
  ) {
    items = [rawData]
  }

  return items.map(normalizeFeedbackItem).filter(Boolean)
}

export function extractTotalCount(rawData, fallbackLength = 0) {
  if (!rawData) return fallbackLength
  return (
    rawData?.totalItems ??
    rawData?.totalCount ??
    rawData?.total ??
    rawData?.count ??
    rawData?.data?.totalItems ??
    rawData?.data?.totalCount ??
    rawData?.data?.total ??
    rawData?.data?.count ??
    rawData?.pagination?.totalItems ??
    rawData?.pagination?.totalCount ??
    rawData?.data?.pagination?.totalItems ??
    fallbackLength
  )
}
