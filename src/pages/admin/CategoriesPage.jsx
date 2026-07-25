/**
 * src/pages/admin/CategoriesPage.jsx
 * ----------------------------------------------------------------------------
 * Route: /admin/categories. Maps to README's "Dynamic Category Management".
 *
 * Responsibilities:
 *   - On mount, dispatch loadCategories().
 *   - Own modal open/close + selected-category-for-edit state.
 *   - Own delete confirmation flow (TODO: use a confirm <Modal> instead of
 *     window.confirm before dispatching removeCategory).
 *   - Compose <CategoryList /> + <CategoryModal />.
 * ----------------------------------------------------------------------------
 */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loadCategories, removeCategory } from "../../store/slices/categoriesSlice";
import { useToast } from "../../context/ToastContext";
import CategoryList from "../../components/adminPortal/categories/CategoryList";
import CategoryModal from "../../components/adminPortal/categories/CategoryModal";
import Button from "../../components/common/Button/Button";
import styles from "./CategoriesPage.module.css";

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    dispatch(loadCategories());
  }, [dispatch]);

  const openCreate = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const openEdit = (category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleDelete = async (category) => {
    // TODO: replace with a proper confirm Modal
    try {
      await dispatch(removeCategory(category.id)).unwrap();
    } catch (err) {
      showToast({ type: "error", message: err.message || "Could not delete category." });
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1>Categories</h1>
        <Button onClick={openCreate}>New Category</Button>
      </div>
      <CategoryList onEdit={openEdit} onDelete={handleDelete} />
      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialValues={editingCategory}
      />
    </div>
  );
}
