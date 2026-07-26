import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendChatMessage } from '@features/chat/api/chatApi.js'
import { QUERY_KEYS } from '@app/config/constants.js'

/**
 * Sends one message in the active session. On success, invalidates that
 * session's message list so both the user's message and the assistant's
 * reply (persisted server-side per Flow 3) appear together -- this is
 * simpler and more consistent than optimistically appending just the user
 * message and separately splicing in the assistant reply from the mutation
 * response.
 */
export function useSendMessage(sessionId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (content) => sendChatMessage(sessionId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chatMessages(sessionId) })
    },
  })
}
