/**
 * src/components/common/Table/Table.jsx
 * ----------------------------------------------------------------------------
 * Generic, dumb table renderer driven entirely by a `columns` config, so
 * feature code never hand-writes <table><thead><tbody> markup.
 *
 * Props:
 *   - columns: Array<{ key: string, header: string, render?: (row) => ReactNode }>
 *   - rows: Array<object> (each row must have a unique `id` field)
 *   - isLoading: boolean — shows <Loader /> in place of rows
 *   - emptyMessage: string — shown via <EmptyState /> when rows.length === 0
 *
 * Usage (e.g. CategoryList.jsx):
 *   <Table
 *     columns={[
 *       { key: 'name', header: 'Name' },
 *       { key: 'description', header: 'Description' },
 *       { key: 'actions', header: '', render: (row) => <RowActions row={row} /> },
 *     ]}
 *     rows={categories}
 *   />
 * ----------------------------------------------------------------------------
 */
import React from "react";
import Loader from "../Loader/Loader";
import EmptyState from "../EmptyState/EmptyState";
import styles from "./Table.module.css";

export default function Table({ columns, rows, isLoading, emptyMessage = "No data yet." }) {
  if (isLoading) return <Loader />;
  if (!rows || rows.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {columns.map((col) => (
              <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
