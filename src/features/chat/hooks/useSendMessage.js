import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendChatMessage, updateChatSession } from '@features/chat/api/chatApi.js'
import { generateTitleFromMessage } from '@features/chat/hooks/useChatSession.js'
import { QUERY_KEYS } from '@app/config/constants.js'

/**
 * Sends one message in the active session. On success, invalidates that
 * session's message list and sessions list so both the user's message,
 * assistant reply, and context-derived title update immediately.
 */
export function useSendMessage(sessionId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (content) => {
      const result = await sendChatMessage(sessionId, content)

      // Attempt to set a smart context title if this is the first message
      try {
        const existingMessages = queryClient.getQueryData(QUERY_KEYS.chatMessages(sessionId))
        const msgList = Array.isArray(existingMessages)
          ? existingMessages
          : Array.isArray(existingMessages?.items)
          ? existingMessages.items
          : Array.isArray(existingMessages?.data)
          ? existingMessages.data
          : Array.isArray(existingMessages?.$values)
          ? existingMessages.$values
          : []

        if (msgList.length === 0) {
          const autoTitle = generateTitleFromMessage(content)
          await updateChatSession(sessionId, { title: autoTitle })
        }
      } catch {
        // Ignore title update failures if backend handles title auto-generation
      }

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chatMessages(sessionId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chatSessions })
    },
  })
}
