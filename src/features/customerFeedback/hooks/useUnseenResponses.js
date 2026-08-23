import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '@shared/hooks/useAuth.js'

const EVENT_NAME = 'feedinsight:seen_responses_updated'

function getStorageKey(userId) {
  return `feedinsight_seen_responses_${userId || 'customer'}`
}

function loadSeenMap(userId) {
  try {
    const raw = localStorage.getItem(getStorageKey(userId))
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveSeenMap(userId, map) {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(map))
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { userId, map } }))
  } catch (err) {
    console.error('Failed to save seen responses to localStorage:', err)
  }
}

/**
 * Hook to manage unseen product team responses on customer feedback items.
 * @param {Array} items List of feedback items for the customer
 */
export function useUnseenResponses(items = []) {
  const { user } = useAuth()
  const userId = user?.id || user?.userId || 'customer'

  const [seenMap, setSeenMap] = useState(() => loadSeenMap(userId))

  useEffect(() => {
    setSeenMap(loadSeenMap(userId))

    const handleSync = (e) => {
      if (!e.detail || e.detail.userId === userId) {
        setSeenMap(loadSeenMap(userId))
      }
    }

    window.addEventListener(EVENT_NAME, handleSync)
    window.addEventListener('storage', handleSync)
    return () => {
      window.removeEventListener(EVENT_NAME, handleSync)
      window.removeEventListener('storage', handleSync)
    }
  }, [userId])

  const markAsSeen = useCallback(
    (feedbackId, count) => {
      if (!feedbackId) return
      setSeenMap((prev) => {
        const currentCount = prev[feedbackId] || 0
        const newCount = count !== undefined ? count : (currentCount + 1)
        if (newCount <= currentCount) return prev

        const updated = { ...prev, [feedbackId]: newCount }
        saveSeenMap(userId, updated)
        return updated
      })
    },
    [userId],
  )

  const markAllAsSeen = useCallback(
    (feedbackList = items) => {
      if (!feedbackList || !feedbackList.length) return
      setSeenMap((prev) => {
        const updated = { ...prev }
        feedbackList.forEach((fb) => {
          if (fb?.id) {
            updated[fb.id] = fb.comments?.length || 0
          }
        })
        saveSeenMap(userId, updated)
        return updated
      })
    },
    [userId, items],
  )

  const hasUnseen = useCallback(
    (feedbackId, currentCommentsCount = 0) => {
      if (!feedbackId) return false
      const seen = seenMap[feedbackId] || 0
      return currentCommentsCount > seen
    },
    [seenMap],
  )

  const getUnseenCount = useCallback(
    (feedbackId, currentCommentsCount = 0) => {
      if (!feedbackId) return 0
      const seen = seenMap[feedbackId] || 0
      return Math.max(0, currentCommentsCount - seen)
    },
    [seenMap],
  )

  const totalUnseenCount = useMemo(() => {
    if (!items || !items.length) return 0
    return items.reduce((acc, item) => {
      const commentsCount = item.comments?.length || 0
      const seen = seenMap[item.id] || 0
      return acc + Math.max(0, commentsCount - seen)
    }, 0)
  }, [items, seenMap])

  return {
    seenMap,
    markAsSeen,
    markAllAsSeen,
    hasUnseen,
    getUnseenCount,
    totalUnseenCount,
  }
}
