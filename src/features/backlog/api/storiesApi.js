import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

export async function fetchDraftStories(params = {}) {
  const { data } = await axiosClient.get(ENDPOINTS.stories.listDrafts, { params })
  return data
}

export async function fetchStoryDetail(id) {
  const { data } = await axiosClient.get(ENDPOINTS.stories.detail(id))
  return data
}

export async function fetchStoryDuplicates(id) {
  const { data } = await axiosClient.get(ENDPOINTS.stories.duplicates(id))
  return data
}

export async function approveStory(id, payload) {
  const { data } = await axiosClient.post(ENDPOINTS.stories.approve(id), payload)
  return data
}

export async function rejectStory(id, reason) {
  const { data } = await axiosClient.post(ENDPOINTS.stories.reject(id), { reason })
  return data
}

export async function publishStoryToJira(id) {
  const { data } = await axiosClient.post(ENDPOINTS.stories.publishToJira(id))
  return data
}
