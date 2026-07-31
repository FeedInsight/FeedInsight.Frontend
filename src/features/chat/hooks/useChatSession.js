import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchChatSessions,
  createChatSession,
  fetchChatMessages,
  clearChatSession,
} from '@features/chat/api/chatApi.js'
import { QUERY_KEYS } from '@app/config/constants.js'
import { useUiStore } from '@app/store/uiStore.js'

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
      setActiveChatSessionId(session.id)
    },
  })
}

export function useClearChatSession(sessionId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => clearChatSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chatMessages(sessionId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chatSessions })
    },
  })
}
