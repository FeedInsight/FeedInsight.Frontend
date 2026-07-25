/**
 * src/api/chatApi.js
 * ----------------------------------------------------------------------------
 * Maps to ChatSessions / ChatMessages tables — Flow 3 (AI Product Assistant,
 * Contextual Memory Chat). Consumed by src/store/slices/chatSlice.js and
 * src/components/adminPortal/chat/*, plus src/hooks/useChatStream.js if
 * REACT_APP_ENABLE_CHAT_STREAMING is true.
 * ----------------------------------------------------------------------------
 */
import axiosClient from "./axiosClient";
import ENDPOINTS from "./endpoints";

/** @returns {Promise<Array<{ id, title, createdAt }>>} */
export function fetchChatSessions() {
  // TODO: GET ENDPOINTS.CHAT.SESSIONS
  return axiosClient.get(ENDPOINTS.CHAT.SESSIONS);
}

export function createChatSession(title) {
  // TODO: POST ENDPOINTS.CHAT.SESSIONS with { title }
  return axiosClient.post(ENDPOINTS.CHAT.SESSIONS, { title });
}

/** @returns {Promise<Array<{ id, senderRole: 'user'|'assistant', content, createdAt }>>} */
export function fetchChatMessages(sessionId) {
  // TODO: GET ENDPOINTS.CHAT.MESSAGES(sessionId)
  return axiosClient.get(ENDPOINTS.CHAT.MESSAGES(sessionId));
}

/**
 * Non-streaming fallback. If REACT_APP_ENABLE_CHAT_STREAMING=true, prefer
 * src/hooks/useChatStream.js instead (SSE/fetch-stream against the same
 * logical endpoint on the backend).
 */
export function sendChatMessage(sessionId, content) {
  // TODO: POST ENDPOINTS.CHAT.SEND_MESSAGE(sessionId) with { content }
  return axiosClient.post(ENDPOINTS.CHAT.SEND_MESSAGE(sessionId), { content });
}

export function clearChatHistory(sessionId) {
  // TODO: POST ENDPOINTS.CHAT.CLEAR_HISTORY(sessionId)
  return axiosClient.post(ENDPOINTS.CHAT.CLEAR_HISTORY(sessionId));
}
