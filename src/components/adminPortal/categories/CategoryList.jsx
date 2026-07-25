/**
 * src/components/adminPortal/categories/CategoryList.jsx
 * ----------------------------------------------------------------------------
 * Renders state.categories.items via the generic <Table />. Read-only —
 * editing/deleting is delegated to row actions that open <CategoryModal />.
 *
 * Props:
 *   - onEdit: (category) => void
 *   - onDelete: (category) => void
 * ----------------------------------------------------------------------------
 */
import React from "react";
import { useSelector } from "react-redux";
import Table from "../../common/Table/Table";
import Button from "../../common/Button/Button";

export default function CategoryList({ onEdit, onDelete }) {
  const { items, status } = useSelector((state) => state.categories);

  const columns = [
    { key: "name", header: "Name" },
    { key: "description", header: "Description" },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div>
          <Button variant="ghost" size="sm" onClick={() => onEdit(row)}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      rows={items}
      isLoading={status === "loading"}
      emptyMessage="No categories yet. Create one to start classifying feedback."
    />
  );
}
