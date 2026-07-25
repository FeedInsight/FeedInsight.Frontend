/**
 * src/pages/customer/FeedbackSubmissionPage.jsx
 * ----------------------------------------------------------------------------
 * Route: /feedback (public, no auth, no AdminLayout chrome).
 *
 * Responsibilities:
 *   - Wait on useTenant() to resolve the tenant before rendering the form
 *     (show <Loader /> while isResolving, show an error state if
 *     resolveError is set — a bad/missing tenant key should not silently
 *     show a form that will fail on submit).
 *   - Toggle between <FeedbackForm /> and <FeedbackSuccess /> based on local
 *     `submitted` state.
 * ----------------------------------------------------------------------------
 */
import React, { useState } from "react";
import { useTenant } from "../../context/TenantContext";
import FeedbackForm from "../../components/customerPortal/FeedbackForm/FeedbackForm";
import FeedbackSuccess from "../../components/customerPortal/FeedbackSuccess/FeedbackSuccess";
import Loader from "../../components/common/Loader/Loader";
import styles from "./FeedbackSubmissionPage.module.css";

export default function FeedbackSubmissionPage() {
  const { tenant, isResolving, resolveError } = useTenant();
  const [submitted, setSubmitted] = useState(false);

  if (isResolving) {
    return <Loader fullPage label="Loading…" />;
  }

  if (resolveError || !tenant) {
    // TODO: nicer branded error state
    return <p className={styles.error}>This feedback link is invalid or has expired.</p>;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>
        {tenant.companyName ? `Feedback for ${tenant.companyName}` : "Share your feedback"}
      </h1>
      {submitted ? (
        <FeedbackSuccess onSubmitAnother={() => setSubmitted(false)} />
      ) : (
        <FeedbackForm onSubmitted={() => setSubmitted(true)} />
      )}
    </div>
  );
}
