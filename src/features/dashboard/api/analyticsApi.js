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
  try {
    const { data } = await axiosClient.get(ENDPOINTS.analytics.dailySnapshots, { params: range })
    return data ?? []
  } catch (err) {
    if (err?.response?.status === 404) {
      try {
        const { data: feedbacksResponse } = await axiosClient.get(ENDPOINTS.feedback.list)
        const items = Array.isArray(feedbacksResponse)
          ? feedbacksResponse
          : Array.isArray(feedbacksResponse?.data)
          ? feedbacksResponse.data
          : Array.isArray(feedbacksResponse?.items)
          ? feedbacksResponse.items
          : []

        const map = {}
        for (const item of items) {
          const dateStr = item.createdAt ? item.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
          if (!map[dateStr]) {
            map[dateStr] = {
              date: dateStr,
              positiveCount: 0,
              neutralCount: 0,
              negativeCount: 0,
              newFeedbackCount: 0,
              newStoriesCount: 0,
            }
          }
          map[dateStr].newFeedbackCount += 1
          const sentiment = (item.overallSentiment ?? '').toLowerCase()
          if (sentiment.includes('positive')) map[dateStr].positiveCount += 1
          else if (sentiment.includes('negative')) map[dateStr].negativeCount += 1
          else map[dateStr].neutralCount += 1

          map[dateStr].newStoriesCount += Array.isArray(item.extractedTasks) ? item.extractedTasks.length : 0
        }

        const snapshots = Object.values(map).sort((a, b) => a.date.localeCompare(b.date))
        if (snapshots.length === 0) {
          const today = new Date().toISOString().split('T')[0]
          return [
            {
              date: today,
              positiveCount: 0,
              neutralCount: 0,
              negativeCount: 0,
              newFeedbackCount: 0,
              newStoriesCount: 0,
            },
          ]
        }
        return snapshots
      } catch {
        return []
      }
    }
    throw err
  }
}
