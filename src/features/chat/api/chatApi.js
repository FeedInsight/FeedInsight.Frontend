import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

export async function fetchChatSessions() {
  const { data } = await axiosClient.get(ENDPOINTS.chat.sessions)
  return data
}

export async function createChatSession(payload = {}) {
  const { data } = await axiosClient.post(ENDPOINTS.chat.sessions, payload)
  return data
}

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

export async function clearChatSession(sessionId) {
  const { data } = await axiosClient.delete(ENDPOINTS.chat.sessionDetail(sessionId))
  return data
}
