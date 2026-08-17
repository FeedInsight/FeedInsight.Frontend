import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

export const fetchLatestAnalyticsSnapshot = async () => {
  const { data } = await axiosClient.get(ENDPOINTS.analytics.latestSnapshot)
  return data?.data
}

export const fetchAnalyticsSnapshots = async ({ from, to, page = 1, pageSize = 90 }) => {
  const { data } = await axiosClient.get(ENDPOINTS.analytics.snapshots, {
    params: {
      From: from,
      To: to,
      Page: page,
      PageSize: pageSize,
    },
  })
  return data?.data
}
