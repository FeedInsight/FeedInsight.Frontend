import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

/** ChatSessions list/create -- matches CHATSESSIONS table. */
export async function fetchChatSessions() {
  const { data } = await axiosClient.get(ENDPOINTS.chat.sessions)
  return data
}

/** @param {{ title?: string }} payload -- title can be auto-generated
 * server-side from the first message if omitted. */
export async function createChatSession(payload = {}) {
  const { data } = await axiosClient.post(ENDPOINTS.chat.sessions, payload)
  return data
}

/** Full message history for one session, matches CHATMESSAGES table. */
export async function fetchChatMessages(sessionId) {
  const { data } = await axiosClient.get(ENDPOINTS.chat.sessionMessages(sessionId))
  return data
}

/**
 * Sends a user message and returns the assistant's reply.
 * SendAssistantMessageCommand server-side triggers Flow 3: embed the query,
 * retrieve context chunks from Qdrant, pull conversational history from
 * SQL, then call GPT-4o mini via Semantic Kernel.
 * @param {string} sessionId
 * @param {string} content
 */
export async function sendChatMessage(sessionId, content) {
  const { data } = await axiosClient.post(ENDPOINTS.chat.sessionMessages(sessionId), { content })
  return data
}

/** ClearHistoryCommandHandler. */
export async function clearChatSession(sessionId) {
  const { data } = await axiosClient.delete(ENDPOINTS.chat.clearSession(sessionId))
  return data
}
