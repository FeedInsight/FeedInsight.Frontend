/**
 * src/components/adminPortal/chat/ChatInput.jsx
 * ----------------------------------------------------------------------------
 * Message composer at the bottom of <ChatWindow />.
 *
 * Props:
 *   - onSend: (content: string) => void
 *   - disabled: boolean — true while a response is streaming/pending
 * ----------------------------------------------------------------------------
 */
import React, { useState } from "react";
import Button from "../../common/Button/Button";
import styles from "./ChatInput.module.css";

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask about your backlog…"
        disabled={disabled}
      />
      <Button type="submit" disabled={disabled || !value.trim()}>
        Send
      </Button>
    </form>
  );
}
