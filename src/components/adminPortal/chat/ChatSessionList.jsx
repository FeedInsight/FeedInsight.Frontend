/**
 * src/components/adminPortal/chat/ChatSessionList.jsx
 * ----------------------------------------------------------------------------
 * Left column of the AI Product Assistant page — list of past chat sessions
 * (ChatSessions table), plus a "New chat" action.
 *
 * Props:
 *   - activeSessionId: string | null
 *   - onSelectSession: (id) => void
 *   - onNewSession: () => void
 * ----------------------------------------------------------------------------
 */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSessions } from "../../../store/slices/chatSlice";
import Button from "../../common/Button/Button";
import clsx from "clsx";
import styles from "./ChatSessionList.module.css";

export default function ChatSessionList({ activeSessionId, onSelectSession, onNewSession }) {
  const dispatch = useDispatch();
  const sessions = useSelector((state) => state.chat.sessions);

  useEffect(() => {
    dispatch(loadSessions());
  }, [dispatch]);

  return (
    <div className={styles.wrapper}>
      <Button onClick={onNewSession}>New chat</Button>
      <ul className={styles.list}>
        {sessions.map((session) => (
          <li
            key={session.id}
            className={clsx(styles.item, session.id === activeSessionId && styles.active)}
            onClick={() => onSelectSession(session.id)}
          >
            {session.title || "Untitled chat"}
          </li>
        ))}
      </ul>
    </div>
  );
}
