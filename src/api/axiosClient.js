/**
 * src/api/axiosClient.js
 * ----------------------------------------------------------------------------
 * The single configured axios instance used by every *Api.js file in this
 * folder. No other file in the project should import "axios" directly.
 *
 * Responsibilities:
 *   - Set baseURL from src/config.js.
 *   - REQUEST interceptor:
 *       - Attach `Authorization: Bearer <jwt>` for Admin Portal calls
 *         (read token via src/utils/storage.js, NOT directly from localStorage).
 *       - Attach `X-Tenant-Id` header for every request:
 *           - Admin Portal: resolved from the logged-in AdminUser's TenantId
 *             (decoded from JWT or stored at login time).
 *           - Customer Portal: resolved from TenantContext, itself derived
 *             from subdomain / public key (see src/context/TenantContext.jsx).
 *   - RESPONSE interceptor:
 *       - Unwrap `response.data` so callers get plain DTOs.
 *       - On 401: clear stored auth (src/utils/storage.js) and redirect to
 *         /admin/login (only relevant for Admin Portal calls).
 *       - On 403/404/422/500: normalize into a consistent `{ status, message,
 *         errors }` shape and reject so callers/hooks can display it via
 *         ToastContext.
 * ----------------------------------------------------------------------------
 */
import axios from "axios";
import config from "../config";
import { getAuthToken, getTenantId, clearAuth } from "../utils/storage";

const axiosClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use((requestConfig) => {
  const token = getAuthToken();
  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }

  const tenantId = getTenantId();
  if (tenantId) {
    requestConfig.headers["X-Tenant-Id"] = tenantId;
  }

  // TODO: if requestConfig.data is FormData (screenshot upload), let axios
  // set the multipart boundary itself — do not manually set Content-Type.

  return requestConfig;
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearAuth();
      // TODO: redirect to /admin/login. Prefer dispatching a custom event or
      // using an imperative navigate() passed in from a top-level listener,
      // since axios interceptors live outside the React Router context.
    }

    const normalized = {
      status: error.response ? error.response.status : 0,
      message:
        (error.response && error.response.data && error.response.data.message) ||
        "Unexpected error. Please try again.",
      errors: (error.response && error.response.data && error.response.data.errors) || null,
    };

    return Promise.reject(normalized);
  }
);

export default axiosClient;
