/**
 * src/components/common/Pagination/Pagination.jsx
 * ----------------------------------------------------------------------------
 * Dumb pagination control, paired with src/hooks/usePagination.js.
 *
 * Props:
 *   - page: number
 *   - pageSize: number
 *   - totalCount: number
 *   - onNext: () => void
 *   - onPrevious: () => void
 * ----------------------------------------------------------------------------
 */
import React from "react";
import Button from "../Button/Button";
import styles from "./Pagination.module.css";

export default function Pagination({ page, pageSize, totalCount, onNext, onPrevious }) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className={styles.wrapper}>
      <Button variant="secondary" size="sm" onClick={onPrevious} disabled={page <= 1}>
        Previous
      </Button>
      <span className={styles.pageLabel}>
        Page {page} of {totalPages}
      </span>
      <Button variant="secondary" size="sm" onClick={onNext} disabled={page >= totalPages}>
        Next
      </Button>
    </div>
  );
}
