import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '@shared/hooks/useAuth.js'

const EVENT_NAME = 'feedinsight:po_seen_feedbacks_updated'

function getStorageKey(userId) {
  return `feedinsight_po_seen_feedbacks_${userId || 'po'}`
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
    console.error('Failed to save PO seen feedbacks to localStorage:', err)
  }
}

/**
 * Hook to track unseen customer feedbacks for Product Owner.
 * @param {Array} items List of normalized company feedback items
 */
export function usePOUnseenCompanyFeedbacks(items = []) {
  const { user } = useAuth()
  const userId = user?.id || user?.userId || 'po'

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
    (feedbackId) => {
      if (!feedbackId) return
      setSeenMap((prev) => {
        if (prev[feedbackId]) return prev
        const updated = { ...prev, [feedbackId]: true }
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
            updated[fb.id] = true
          }
        })
        saveSeenMap(userId, updated)
        return updated
      })
    },
    [userId, items],
  )

  const isUnseen = useCallback(
    (feedbackId) => {
      if (!feedbackId) return false
      return !seenMap[feedbackId]
    },
    [seenMap],
  )

  const totalUnseenCount = useMemo(() => {
    if (!items || !items.length) return 0
    return items.filter((item) => !seenMap[item.id]).length
  }, [items, seenMap])

  return {
    seenMap,
    markAsSeen,
    markAllAsSeen,
    isUnseen,
    totalUnseenCount,
  }
}
