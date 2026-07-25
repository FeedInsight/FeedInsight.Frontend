/**
 * src/api/feedbackApi.js
 * ----------------------------------------------------------------------------
 * Maps to CustomerFeedbacks table + the public ingestion endpoint from Flow 2
 * (Live Feedback Routing & Triage Pipeline).
 * Consumed by:
 *   - src/components/customerPortal/FeedbackForm (SUBMIT — public, no auth)
 *   - src/pages/admin (future feedback log view, if added — LIST/BY_ID)
 * ----------------------------------------------------------------------------
 */
import axiosClient from "./axiosClient";
import ENDPOINTS from "./endpoints";

/**
 * Public submission from the Customer Portal.
 * @param {{ rawContent: string, submitterEmail?: string, screenshot?: File }} payload
 * Sent as multipart/form-data per README ("Packages unstructured text payloads
 * alongside optional screenshots securely via multipart/form-data").
 */
export function submitFeedback(payload) {
  const formData = new FormData();
  formData.append("rawContent", payload.rawContent);
  if (payload.submitterEmail) {
    formData.append("submitterEmail", payload.submitterEmail);
  }
  if (payload.screenshot) {
    formData.append("screenshot", payload.screenshot);
  }
  // TODO: POST ENDPOINTS.FEEDBACK.SUBMIT with formData
  return axiosClient.post(ENDPOINTS.FEEDBACK.SUBMIT, formData);
}

/**
 * Admin-side paginated feedback list (optional, for a future "raw inbox" view).
 * @param {{ page: number, pageSize: number, sentiment?: string }} params
 */
export function fetchFeedbackList(params) {
  // TODO: GET ENDPOINTS.FEEDBACK.LIST with query params
  return axiosClient.get(ENDPOINTS.FEEDBACK.LIST, { params });
}

export function fetchFeedbackById(id) {
  // TODO: GET ENDPOINTS.FEEDBACK.BY_ID(id)
  return axiosClient.get(ENDPOINTS.FEEDBACK.BY_ID(id));
}
