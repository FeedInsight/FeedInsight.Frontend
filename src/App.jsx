/**
 * src/App.jsx
 * ----------------------------------------------------------------------------
 * Top-level component. Responsibilities ONLY:
 *   - Render <AppRoutes /> (src/routes/AppRoutes.jsx).
 *   - Render the single global <ToastContainer /> (src/components/common/Toast)
 *     so toasts triggered from ANYWHERE (customer portal, admin portal, api
 *     interceptors) can render above everything else.
 *   - Optionally render a top-level error boundary wrapper.
 *
 * Do NOT add page markup, headers, sidebars here — those are portal-specific
 * and live inside src/components/adminPortal/layout/AdminLayout.jsx or are
 * simply absent for the public Customer Portal pages.
 * ----------------------------------------------------------------------------
 */
import React from "react";
import AppRoutes from "./routes/AppRoutes";
import ToastContainer from "./components/common/Toast/ToastContainer";

function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  );
}

export default App;
