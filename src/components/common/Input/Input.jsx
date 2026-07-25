/**
 * src/components/common/Input/Input.jsx
 * ----------------------------------------------------------------------------
 * Dumb text input/textarea primitive designed to be spread with
 * react-hook-form's `register()`. No validation logic lives here — that
 * belongs in src/utils/validators.js + the form's resolver/rules.
 *
 * Props:
 *   - label: string
 *   - name: string (for htmlFor/id linkage)
 *   - as: 'input' | 'textarea' (default 'input')
 *   - error: string | undefined — displayed below the field
 *   - ...rest forwarded to the underlying element (register() spread, etc.)
 * ----------------------------------------------------------------------------
 */
import React, { forwardRef } from "react";
import clsx from "clsx";
import styles from "./Input.module.css";

const Input = forwardRef(({ label, name, as = "input", error, ...rest }, ref) => {
  const Tag = as;
  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
        </label>
      )}
      <Tag
        id={name}
        name={name}
        ref={ref}
        className={clsx(styles.input, error && styles.inputError)}
        {...rest}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
