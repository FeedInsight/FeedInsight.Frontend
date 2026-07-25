/**
 * src/pages/auth/LoginPage.jsx
 * ----------------------------------------------------------------------------
 * Route: /admin/login (public).
 *
 * Responsibilities:
 *   - react-hook-form: email + password fields.
 *   - On submit, call useAuth().login(email, password).
 *   - On success, navigate to PATHS.ADMIN_DASHBOARD (or `location.state.from`
 *     if ProtectedRoute redirected here — TODO wire that up).
 *   - On failure, show field/toast error (AdminUsers.PasswordHash mismatch,
 *     inactive account IsActive=false, etc. — surface whatever message the
 *     API returns via the normalized axios error).
 * ----------------------------------------------------------------------------
 */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";
import { isValidEmail, isNonEmpty } from "../../utils/validators";
import PATHS from "../../routes/routePaths";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await login(values.email, values.password);
      navigate(PATHS.ADMIN_DASHBOARD, { replace: true });
    } catch (err) {
      showToast({ type: "error", message: err.message || "Invalid email or password." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit(onSubmit)}>
        <h1>Sign in to FeedInsight</h1>
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register("email", { validate: (v) => isValidEmail(v) || "Enter a valid email." })}
        />
        <Input
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register("password", { validate: (v) => isNonEmpty(v) || "Password is required." })}
        />
        <Button type="submit" isLoading={isSubmitting}>
          Sign in
        </Button>
        <Link className={styles.forgotLink} to={PATHS.ADMIN_FORGOT_PASSWORD}>
          Forgot password?
        </Link>
      </form>
    </div>
  );
}
