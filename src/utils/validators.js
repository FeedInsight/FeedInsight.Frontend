/**
 * src/utils/validators.js
 * ----------------------------------------------------------------------------
 * Pure validation helpers shared across forms. Kept framework-agnostic (no
 * react-hook-form types here) so they're usable from any form implementation.
 * ----------------------------------------------------------------------------
 */
export function isValidEmail(value) {
  // TODO: replace with a properly tested regex or a small validation lib
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isNonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function maxLength(value, max) {
  return typeof value === "string" && value.length <= max;
}

/** Feedback textarea rule: require enough content for the Router Agent to
 * meaningfully split intents (avoid one-word junk submissions). */
export function isSubmittableFeedback(value) {
  return isNonEmpty(value) && value.trim().length >= 10;
}
