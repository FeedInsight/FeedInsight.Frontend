import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

/** GetDraftStoriesQuery -- list of UserStories with Status='Draft', for the
 * "Backlog Review Workspace" (README §Admin Portal). Supports optional
 * filters used by BacklogReviewPage's search/category filter bar. */
export async function fetchDraftStories(params = {}) {
  const { data } = await axiosClient.get(ENDPOINTS.stories.listDrafts, { params })
  return data
}

/** Full detail for StoryDetailPage: title, AcceptanceCriteria (Given-When-
 * Then), UrgencyScore, linked ExtractedTasks, CategoryId. */
export async function fetchStoryDetail(id) {
  const { data } = await axiosClient.get(ENDPOINTS.stories.detail(id))
  return data
}

/** Qdrant K-NN semantic matches for a given draft story (README Flow 2,
 * step 3: "Semantic K-NN Search"). Used by DuplicateMatchPanel. */
export async function fetchStoryDuplicates(id) {
  const { data } = await axiosClient.get(ENDPOINTS.stories.duplicates(id))
  return data
}

/** ApproveStoryCommandHandler. `payload` optionally carries edited
 * title/acceptanceCriteria/urgencyScore if the reviewer adjusted the
 * AI draft before approving. */
export async function approveStory(id, payload) {
  const { data } = await axiosClient.post(ENDPOINTS.stories.approve(id), payload)
  return data
}

export async function rejectStory(id, reason) {
  const { data } = await axiosClient.post(ENDPOINTS.stories.reject(id), { reason })
  return data
}

/** Triggers actual Jira issue creation via IJiraService once a story has
 * been approved -- separate step so "Approved" and "Published" (has a
 * JiraTicketKey) remain distinct states, matching UserStories.Status. */
export async function publishStoryToJira(id) {
  const { data } = await axiosClient.post(ENDPOINTS.stories.publishToJira(id))
  return data
}
