/**
 * src/api/storiesApi.js
 * ----------------------------------------------------------------------------
 * Maps to UserStories (+ related ExtractedTasks) tables — the "Backlog Review
 * Workspace" from the README: side-by-side AI-drafted stories, urgency
 * scores, and duplicate matching vectors, with manual Jira publish approval.
 * Consumed by src/store/slices/storiesSlice.js and
 * src/components/adminPortal/backlog/*.
 * ----------------------------------------------------------------------------
 */
import axiosClient from "./axiosClient";
import ENDPOINTS from "./endpoints";

/**
 * @param {{ page, pageSize, status?: 'Draft'|'Approved'|'Rejected', categoryId? }} params
 */
export function fetchStories(params) {
  // TODO: GET ENDPOINTS.STORIES.LIST with query params
  return axiosClient.get(ENDPOINTS.STORIES.LIST, { params });
}

export function fetchStoryById(id) {
  // TODO: GET ENDPOINTS.STORIES.BY_ID(id) — include linked ExtractedTasks
  return axiosClient.get(ENDPOINTS.STORIES.BY_ID(id));
}

/**
 * Confirms Jira publication for a Draft story (README: "before manually
 * confirming Jira publication").
 */
export function approveStory(id) {
  // TODO: POST ENDPOINTS.STORIES.APPROVE(id)
  return axiosClient.post(ENDPOINTS.STORIES.APPROVE(id));
}

export function rejectStory(id, reason) {
  // TODO: POST ENDPOINTS.STORIES.REJECT(id) with { reason }
  return axiosClient.post(ENDPOINTS.STORIES.REJECT(id), { reason });
}

/** @param {string} id @param {string} acceptanceCriteria Given-When-Then text */
export function updateAcceptanceCriteria(id, acceptanceCriteria) {
  // TODO: PATCH/PUT ENDPOINTS.STORIES.UPDATE_CRITERIA(id)
  return axiosClient.put(ENDPOINTS.STORIES.UPDATE_CRITERIA(id), { acceptanceCriteria });
}

/**
 * @returns {Promise<Array<{ storyId, title, similarityScore }>>}
 * Qdrant K-NN duplicate matches for the "duplicate matching vectors" panel.
 */
export function fetchDuplicateMatches(id) {
  // TODO: GET ENDPOINTS.STORIES.DUPLICATES(id)
  return axiosClient.get(ENDPOINTS.STORIES.DUPLICATES(id));
}
