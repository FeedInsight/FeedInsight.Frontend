import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

/**
 * Fetches pre-calculated daily analytics snapshots (README: "lightning-fast
 * daily data snapshots" from DailyAnalyticsSnapshots table, populated by an
 * IHostedService background job -- never computed live in the browser).
 *
 * @param {{ from: string, to: string }} range - ISO date strings
 * @returns {Promise<Array<{ date: string, positiveCount: number, neutralCount: number,
 *   negativeCount: number, newFeedbackCount: number, newStoriesCount: number }>>}
 */
export async function fetchDailySnapshots(range) {
  const { data } = await axiosClient.get(ENDPOINTS.analytics.dailySnapshots, { params: range })
  return data
}
