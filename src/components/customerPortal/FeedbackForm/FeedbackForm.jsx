/**
 * src/components/customerPortal/FeedbackForm/FeedbackForm.jsx
 * ----------------------------------------------------------------------------
 * The core Customer Portal component (README: "public-facing, stateless
 * frontend interface that securely routes customer text inputs directly to
 * the platform API").
 *
 * Props:
 *   - onSubmitted: (result) => void — called after a successful submission so
 *     the parent page can swap in <FeedbackSuccess />.
 *
 * Responsibilities:
 *   - react-hook-form managed fields: rawContent (textarea, required, uses
 *     validators.isSubmittableFeedback), submitterEmail (optional, uses
 *     validators.isValidEmail), screenshot (optional file input, only
 *     rendered if config.features.screenshotUpload).
 *   - On submit: call feedbackApi.submitFeedback(values) directly (this is
 *     public/unauthenticated, so it intentionally does NOT go through a
 *     Redux thunk — there's no shared state to keep in sync here).
 *   - Show inline submit error via useToast on failure.
 *   - Delegates the actual file input UI to <ScreenshotUploader />.
 * ----------------------------------------------------------------------------
 */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as feedbackApi from "../../../api/feedbackApi";
import { useToast } from "../../../context/ToastContext";
import { isSubmittableFeedback, isValidEmail } from "../../../utils/validators";
import config from "../../../config";
import Input from "../../common/Input/Input";
import Button from "../../common/Button/Button";
import ScreenshotUploader from "../ScreenshotUploader/ScreenshotUploader";
import styles from "./FeedbackForm.module.css";

export default function FeedbackForm({ onSubmitted }) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const { showToast } = useToast();

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const result = await feedbackApi.submitFeedback({
        rawContent: values.rawContent,
        submitterEmail: values.submitterEmail,
        screenshot,
      });
      onSubmitted(result);
    } catch (err) {
      showToast({ type: "error", message: err.message || "Could not submit your feedback." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Input
        as="textarea"
        rows={6}
        label="Tell us what's going on"
        placeholder="e.g. Checkout freezes when I pay with Visa, and I'd love Apple Pay support too…"
        error={errors.rawContent?.message}
        {...register("rawContent", {
          validate: (v) => isSubmittableFeedback(v) || "Please add a bit more detail.",
        })}
      />

      <Input
        label="Email (optional, so we can follow up)"
        type="email"
        error={errors.submitterEmail?.message}
        {...register("submitterEmail", {
          validate: (v) => !v || isValidEmail(v) || "Please enter a valid email.",
        })}
      />

      {config.features.screenshotUpload && (
        <ScreenshotUploader onFileSelected={setScreenshot} />
      )}

      <Button type="submit" isLoading={isSubmitting}>
        Submit feedback
      </Button>
    </form>
  );
}
