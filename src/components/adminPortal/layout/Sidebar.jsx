/**
 * src/components/adminPortal/layout/Sidebar.jsx
 * ----------------------------------------------------------------------------
 * Left navigation for the Admin Portal: Dashboard, Categories, Backlog
 * Review, AI Assistant, Settings — matches the "Admin Portal (Control
 * Center)" section of the platform README.
 *
 * Uses <NavLink> for automatic active-route styling. No data fetching here.
 * ----------------------------------------------------------------------------
 */
import React from "react";
import { NavLink } from "react-router-dom";
import PATHS from "../../../routes/routePaths";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { to: PATHS.ADMIN_DASHBOARD, label: "Dashboard" },
  { to: PATHS.ADMIN_CATEGORIES, label: "Categories" },
  { to: PATHS.ADMIN_BACKLOG, label: "Backlog Review" },
  { to: PATHS.ADMIN_CHAT, label: "AI Assistant" },
  { to: PATHS.ADMIN_SETTINGS, label: "Settings" },
];

export default function Sidebar() {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>FeedInsight</div>
      <ul className={styles.navList}>
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
