/**
 * src/components/adminPortal/chat/ChatMessageBubble.jsx
 * ----------------------------------------------------------------------------
 * Renders a single chat message, styled differently for user vs assistant
 * (README Flow 3: conversational thread with contextual memory).
 *
 * Props:
 *   - message: { id, senderRole: 'user'|'assistant', content, createdAt }
 * ----------------------------------------------------------------------------
 */
import React from "react";
import clsx from "clsx";
import { CHAT_SENDER_ROLE } from "../../../utils/constants";
import styles from "./ChatMessageBubble.module.css";

export default function ChatMessageBubble({ message }) {
  const isUser = message.senderRole === CHAT_SENDER_ROLE.USER;
  return (
    <div className={clsx(styles.row, isUser ? styles.userRow : styles.assistantRow)}>
      <div className={clsx(styles.bubble, isUser ? styles.userBubble : styles.assistantBubble)}>
        {message.content}
      </div>
    </div>
  );
}
