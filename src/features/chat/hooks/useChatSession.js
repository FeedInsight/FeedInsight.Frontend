import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  fetchChatSessions,
  createChatSession,
  fetchChatMessages,
  clearChatSession,
  updateChatSession,
} from '@features/chat/api/chatApi.js'
import { QUERY_KEYS } from '@app/config/constants.js'
import { useUiStore } from '@app/store/uiStore.js'

/**
 * Generate a clean, context-aware title from the first message sent in a conversation.
 */
export function generateTitleFromMessage(messageText) {
  if (!messageText || typeof messageText !== 'string') return 'New Conversation'

  let cleaned = messageText.trim().replace(/[\r\n]+/g, ' ')
  cleaned = cleaned.replace(/^[?\s!.,-]+/, '')

  if (cleaned.length <= 36) {
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
  }

  const truncated = cleaned.slice(0, 35)
  const lastSpace = truncated.lastIndexOf(' ')
  const finalStr = lastSpace > 18 ? truncated.slice(0, lastSpace) : truncated

  return finalStr.charAt(0).toUpperCase() + finalStr.slice(1) + '…'
}

export function useChatSessions() {
  return useQuery({ queryKey: QUERY_KEYS.chatSessions, queryFn: fetchChatSessions })
}

export function useChatMessages(sessionId) {
  return useQuery({
    queryKey: QUERY_KEYS.chatMessages(sessionId),
    queryFn: () => fetchChatMessages(sessionId),
    enabled: Boolean(sessionId),
  })
}

export function useCreateChatSession() {
  const queryClient = useQueryClient()
  const setActiveChatSessionId = useUiStore((s) => s.setActiveChatSessionId)

  return useMutation({
    mutationFn: createChatSession,
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chatSessions })
      const newId =
        session?.id ||
        session?.data?.id ||
        (Array.isArray(session?.items) ? session.items[0]?.id : null) ||
        (typeof session === 'string' ? session : null)

      if (newId) {
        setActiveChatSessionId(newId)
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to create chat session')
    },
  })
}

export function useUpdateChatSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ sessionId, payload }) => updateChatSession(sessionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chatSessions })
    },
  })
}

export function useClearChatSession(sessionId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (targetId) => clearChatSession(targetId || sessionId),
    onSuccess: (_, targetId) => {
      const id = targetId || sessionId
      if (id) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chatMessages(id) })
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chatSessions })
      toast.success('Conversation deleted successfully')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to delete conversation')
    },
  })
}
