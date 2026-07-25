/**
 * src/components/common/Button/Button.jsx
 * ----------------------------------------------------------------------------
 * Dumb, reusable button primitive. No API calls, no Redux, no Context.
 *
 * Props:
 *   - variant: 'primary' | 'secondary' | 'danger' | 'ghost' (default 'primary')
 *   - size: 'sm' | 'md' | 'lg' (default 'md')
 *   - isLoading: boolean — shows an inline spinner, disables the button
 *   - disabled: boolean
 *   - type: 'button' | 'submit' (default 'button')
 *   - onClick: () => void
 *   - children: ReactNode
 * ----------------------------------------------------------------------------
 */
import React from "react";
import clsx from "clsx";
import styles from "./Button.module.css";

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  type = "button",
  onClick,
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={clsx(styles.button, styles[variant], styles[size])}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...rest}
    >
      {/* TODO: swap in a proper spinner icon component */}
      {isLoading ? "…" : children}
    </button>
  );
}
