import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

/**
 * POST a raw customer feedback submission.
 *
 * @param {Object} payload
 * @param {string} payload.rawContent - free text, maps to CustomerFeedbacks.RawContent
 * @param {string} [payload.submitterEmail] - maps to CustomerFeedbacks.SubmitterEmail
 * @param {File}  [payload.screenshot] - optional image, sent multipart/form-data
 *
 * Backend response (expected): { feedbackId } -- the Router/Triage pipeline
 * (Flow 2 in the README) runs asynchronously after this returns 201, so the
 * UI should show a "thank you, we're processing this" state rather than
 * waiting for classification results.
 */
export async function submitFeedback({ rawContent, submitterEmail, screenshot }) {
  const payload = {
    rawContent,
    submitterEmail: submitterEmail || undefined,
  }

  if (screenshot) {
    const formData = new FormData()
    formData.append('rawContent', rawContent)
    if (submitterEmail) formData.append('submitterEmail', submitterEmail)
    formData.append('screenshot', screenshot)
    try {
      const { data } = await axiosClient.post(ENDPOINTS.feedback.submit, formData)
      return data
    } catch (err) {
      if (err?.response?.status === 415) {
        const { data } = await axiosClient.post(ENDPOINTS.feedback.submit, payload)
        return data
      }
      throw err
    }
  }

  try {
    const { data } = await axiosClient.post(ENDPOINTS.feedback.submit, payload)
    return data
  } catch (err) {
    if (err?.response?.status === 415) {
      const formData = new FormData()
      formData.append('rawContent', rawContent)
      if (submitterEmail) formData.append('submitterEmail', submitterEmail)
      const { data } = await axiosClient.post(ENDPOINTS.feedback.submit, formData)
      return data
    }
    throw err
  }
}
