/**
 * src/components/customerPortal/FeedbackSuccess/FeedbackSuccess.jsx
 * ----------------------------------------------------------------------------
 * Confirmation screen shown after a successful submission on the Customer
 * Portal. Purely presentational.
 *
 * Props:
 *   - onSubmitAnother: () => void — resets FeedbackSubmissionPage back to the form
 * ----------------------------------------------------------------------------
 */
import React from "react";
import Button from "../../common/Button/Button";
import styles from "./FeedbackSuccess.module.css";

export default function FeedbackSuccess({ onSubmitAnother }) {
  return (
    <div className={styles.wrapper}>
      <h2>Thank you!</h2>
      <p>Your feedback has been received and will be reviewed by our product team.</p>
      <Button variant="secondary" onClick={onSubmitAnother}>
        Submit another
      </Button>
    </div>
  );
}
