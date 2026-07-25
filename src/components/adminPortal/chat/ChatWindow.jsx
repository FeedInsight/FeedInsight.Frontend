/**
 * src/components/adminPortal/chat/ChatWindow.jsx
 * ----------------------------------------------------------------------------
 * Right column of the AI Product Assistant page — message history +
 * composer for the active session.
 *
 * Props:
 *   - sessionId: string | null
 *
 * Responsibilities:
 *   - On sessionId change, dispatch loadMessages(sessionId).
 *   - Render state.chat.messagesBySession[sessionId] via <ChatMessageBubble>.
 *   - On send: if config.features.chatStreaming, use useChatStream(sessionId)
 *     to stream the response and append via chatSlice.appendMessage once
 *     complete; otherwise dispatch(sendMessageThunk).
 *   - Auto-scroll to bottom on new message (TODO: implement with a ref +
 *     useEffect on messages.length).
 * ----------------------------------------------------------------------------
 */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadMessages, sendMessageThunk } from "../../../store/slices/chatSlice";
import EmptyState from "../../common/EmptyState/EmptyState";
import ChatMessageBubble from "./ChatMessageBubble";
import ChatInput from "./ChatInput";
import styles from "./ChatWindow.module.css";

export default function ChatWindow({ sessionId }) {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messagesBySession[sessionId] || []);

  useEffect(() => {
    if (sessionId) dispatch(loadMessages(sessionId));
  }, [sessionId, dispatch]);

  if (!sessionId) {
    return <EmptyState message="Select a chat or start a new one to ask about your backlog." />;
  }

  const handleSend = (content) => {
    // TODO: branch on config.features.chatStreaming to use useChatStream instead
    dispatch(sendMessageThunk({ sessionId, content }));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.messages}>
        {messages.map((message) => (
          <ChatMessageBubble key={message.id} message={message} />
        ))}
      </div>
      <ChatInput onSend={handleSend} disabled={false} />
    </div>
  );
}
