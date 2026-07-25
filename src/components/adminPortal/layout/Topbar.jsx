/**
 * src/components/adminPortal/layout/Topbar.jsx
 * ----------------------------------------------------------------------------
 * Top bar shown above every Admin Portal page. Shows the logged-in user's
 * name/role (from useAuth().user) and a logout action.
 *
 * TODO: derive a page title from the current route (e.g. via a small
 * route->title map keyed on useLocation().pathname) instead of a static label.
 * ----------------------------------------------------------------------------
 */
import React from "react";
import useAuth from "../../../hooks/useAuth";
import Button from "../../common/Button/Button";
import styles from "./Topbar.module.css";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.topbar}>
      <div />
      <div className={styles.userArea}>
        {user && (
          <span className={styles.userInfo}>
            {user.fullName} · {user.role}
          </span>
        )}
        <Button variant="ghost" size="sm" onClick={logout}>
          Log out
        </Button>
      </div>
    </header>
  );
}
