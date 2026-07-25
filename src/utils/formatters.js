/**
 * src/utils/formatters.js
 * ----------------------------------------------------------------------------
 * Pure display-formatting helpers (dates, scores, truncation). No side
 * effects, no React.
 * ----------------------------------------------------------------------------
 */
import { format } from "date-fns";

export function formatDate(isoString, pattern = "MMM d, yyyy") {
  if (!isoString) return "";
  // TODO: guard against invalid dates
  return format(new Date(isoString), pattern);
}

export function formatUrgencyLabel(urgencyScore) {
  // TODO: tune thresholds against real backend scoring range (assumed 1-10)
  if (urgencyScore >= 8) return "Critical";
  if (urgencyScore >= 5) return "High";
  if (urgencyScore >= 3) return "Medium";
  return "Low";
}

export function truncate(text, maxChars = 140) {
  if (!text) return "";
  return text.length > maxChars ? `${text.slice(0, maxChars)}…` : text;
}

export function formatSimilarityScore(score) {
  // score expected as 0..1 from Qdrant cosine similarity
  return `${Math.round(score * 100)}%`;
}
