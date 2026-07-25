/**
 * src/pages/admin/ChatAssistantPage.jsx
 * ----------------------------------------------------------------------------
 * Route: /admin/assistant and /admin/assistant/:sessionId. Maps to README's
 * "AI Product Assistant: A persistent, conversational thread interface...
 * maintaining historical chat context."
 *
 * Responsibilities:
 *   - Read :sessionId from useParams() as the active session.
 *   - Own "start a new session" flow: dispatch(startSession(defaultTitle))
 *     then navigate to PATHS.ADMIN_CHAT_SESSION(newSession.id).
 *   - Two-column layout: <ChatSessionList /> (left) + <ChatWindow /> (right).
 * ----------------------------------------------------------------------------
 */
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { startSession } from "../../store/slices/chatSlice";
import PATHS from "../../routes/routePaths";
import ChatSessionList from "../../components/adminPortal/chat/ChatSessionList";
import ChatWindow from "../../components/adminPortal/chat/ChatWindow";
import styles from "./ChatAssistantPage.module.css";

export default function ChatAssistantPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSelectSession = (id) => {
    navigate(PATHS.ADMIN_CHAT_SESSION(id));
  };

  const handleNewSession = async () => {
    // TODO: prompt for a title, or default to "New chat" and let the backend
    // auto-title it from the first message (common assistant UX pattern).
    const result = await dispatch(startSession("New chat")).unwrap();
    navigate(PATHS.ADMIN_CHAT_SESSION(result.id));
  };

  return (
    <div className={styles.layout}>
      <div className={styles.sidebarColumn}>
        <ChatSessionList
          activeSessionId={sessionId}
          onSelectSession={handleSelectSession}
          onNewSession={handleNewSession}
        />
      </div>
      <div className={styles.chatColumn}>
        <ChatWindow sessionId={sessionId} />
      </div>
    </div>
  );
}
