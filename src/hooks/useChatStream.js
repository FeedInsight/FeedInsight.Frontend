/**
 * src/hooks/useChatStream.js
 * ----------------------------------------------------------------------------
 * Only used when config.features.chatStreaming is true. Wraps a streaming
 * connection (SSE via fetch + ReadableStream, or EventSource, depending on
 * what FeedInsight.WebApi exposes for Flow 3) to the chat message endpoint,
 * appending tokens to the in-progress assistant message as they arrive.
 *
 * Usage (from ChatWindow.jsx):
 *   const { streamedText, isStreaming, startStream } = useChatStream(sessionId);
 *   startStream(userMessageContent);
 *
 * Implementation notes:
 *   - Must attach the same Authorization + X-Tenant-Id headers as axiosClient
 *     (fetch() streaming can't reuse axios interceptors directly — read
 *     token/tenantId from src/utils/storage.js here).
 *   - On stream error/abort, fall back to chatApi.sendChatMessage() so the
 *     UI still gets a full response instead of silently failing.
 * ----------------------------------------------------------------------------
 */
import { useState, useCallback, useRef } from "react";
import config from "../config";
import ENDPOINTS from "../api/endpoints";
import { getAuthToken, getTenantId } from "../utils/storage";
import * as chatApi from "../api/chatApi";

export default function useChatStream(sessionId) {
  const [streamedText, setStreamedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef(null);

  const startStream = useCallback(
    async (content) => {
      setStreamedText("");
      setIsStreaming(true);

      if (!config.features.chatStreaming) {
        // Non-streaming fallback path
        const response = await chatApi.sendChatMessage(sessionId, content);
        setStreamedText(response.content);
        setIsStreaming(false);
        return;
      }

      // TODO: implement fetch()-based streaming against
      // `${config.apiBaseUrl}${ENDPOINTS.CHAT.SEND_MESSAGE(sessionId)}` with
      // headers { Authorization: `Bearer ${getAuthToken()}`, 'X-Tenant-Id': getTenantId() },
      // reading response.body via ReadableStreamDefaultReader and appending
      // decoded chunks to `streamedText`. Store the AbortController in
      // abortRef so a "stop generating" button can cancel it.
      setIsStreaming(false);
    },
    [sessionId]
  );

  const stopStream = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    setIsStreaming(false);
  }, []);

  return { streamedText, isStreaming, startStream, stopStream };
}
