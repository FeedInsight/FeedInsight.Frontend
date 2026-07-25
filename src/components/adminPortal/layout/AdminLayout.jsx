/**
 * src/components/adminPortal/layout/AdminLayout.jsx
 * ----------------------------------------------------------------------------
 * Shell for the entire authenticated Admin Portal. Rendered by the
 * ProtectedRoute-wrapped parent <Route> in AppRoutes.jsx; nested admin pages
 * render into <Outlet />.
 *
 * Composition: <Sidebar /> (left nav) + <Topbar /> (page title/user menu) +
 * <Outlet /> (page content).
 * ----------------------------------------------------------------------------
 */
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import styles from "./AdminLayout.module.css";

export default function AdminLayout() {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
