/**
 * src/components/common/Modal/Modal.jsx
 * ----------------------------------------------------------------------------
 * Generic overlay modal. Used by CategoryModal, StoryDetailPanel (if shown
 * as a modal rather than a side panel), and any confirm dialogs.
 *
 * Props:
 *   - isOpen: boolean
 *   - onClose: () => void
 *   - title: string
 *   - children: ReactNode (modal body)
 *   - footer: ReactNode (optional, e.g. action buttons)
 *
 * Implementation notes:
 *   - TODO: render via a portal (ReactDOM.createPortal) into document.body
 *     to avoid z-index/overflow clipping issues from parent containers.
 *   - TODO: trap focus and close on Escape key for accessibility.
 * ----------------------------------------------------------------------------
 */
import React from "react";
import styles from "./Modal.module.css";

export default function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}
