/**
 * src/pages/auth/ForgotPasswordPage.jsx
 * ----------------------------------------------------------------------------
 * Route: /admin/forgot-password (public).
 *
 * Responsibilities:
 *   - Single email field, react-hook-form.
 *   - On submit, call authApi.requestPasswordReset(email) directly (no
 *     Redux/Context involvement — one-shot, unauthenticated action).
 *   - Always show a generic success message regardless of whether the email
 *     exists (avoid account enumeration) — TODO confirm this matches the
 *     backend's actual response contract.
 * ----------------------------------------------------------------------------
 */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as authApi from "../../api/authApi";
import { isValidEmail } from "../../utils/validators";
import PATHS from "../../routes/routePaths";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import styles from "./LoginPage.module.css";

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await authApi.requestPasswordReset(values.email);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Reset your password</h1>
        {submitted ? (
          <p>If that email exists, we&apos;ve sent password reset instructions.</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register("email", { validate: (v) => isValidEmail(v) || "Enter a valid email." })}
            />
            <Button type="submit" isLoading={isSubmitting}>
              Send reset link
            </Button>
          </form>
        )}
        <Link className={styles.forgotLink} to={PATHS.ADMIN_LOGIN}>
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
