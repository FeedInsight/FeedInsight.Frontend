import { SENTIMENT } from '@app/config/constants.js'

/**
 * Maps a CustomerFeedbacks.OverallSentiment value to a Tailwind color
 * token defined in tailwind.config.js (`sentiment.*`). Centralized so the
 * Dashboard sentiment chart and any inline sentiment badge always agree on
 * the same color.
 */
export function sentimentToColor(sentiment) {
  switch (sentiment) {
    case SENTIMENT.POSITIVE:
      return 'text-sentiment-positive'
    case SENTIMENT.NEGATIVE:
      return 'text-sentiment-negative'
    default:
      return 'text-sentiment-neutral'
  }
}
