/**
 * src/components/adminPortal/categories/CategoryModal.jsx
 * ----------------------------------------------------------------------------
 * Thin wrapper composing <Modal> + <CategoryForm>. Owns only the
 * open/closed + which-category-is-being-edited state, lifted from
 * CategoriesPage.
 *
 * Props:
 *   - isOpen: boolean
 *   - onClose: () => void
 *   - initialValues: { id?, name, description } | null
 * ----------------------------------------------------------------------------
 */
import React from "react";
import Modal from "../../common/Modal/Modal";
import CategoryForm from "./CategoryForm";

export default function CategoryModal({ isOpen, onClose, initialValues }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialValues ? "Edit Category" : "New Category"}>
      <CategoryForm initialValues={initialValues} onSaved={onClose} />
    </Modal>
  );
}
