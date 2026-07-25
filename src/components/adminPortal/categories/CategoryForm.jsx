/**
 * src/components/adminPortal/categories/CategoryForm.jsx
 * ----------------------------------------------------------------------------
 * Create/edit form for a Category, rendered inside <CategoryModal />.
 *
 * Props:
 *   - initialValues: { id?, name, description } | null (null = create mode)
 *   - onSaved: () => void — closes the modal on success
 * ----------------------------------------------------------------------------
 */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addCategory, editCategory } from "../../../store/slices/categoriesSlice";
import { useToast } from "../../../context/ToastContext";
import { isNonEmpty } from "../../../utils/validators";
import Input from "../../common/Input/Input";
import Button from "../../common/Button/Button";

export default function CategoryForm({ initialValues, onSaved }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialValues || { name: "", description: "" },
  });
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      if (initialValues?.id) {
        await dispatch(editCategory({ id: initialValues.id, payload: values })).unwrap();
      } else {
        await dispatch(addCategory(values)).unwrap();
      }
      onSaved();
    } catch (err) {
      showToast({ type: "error", message: err.message || "Could not save category." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Name"
        error={errors.name?.message}
        {...register("name", { validate: (v) => isNonEmpty(v) || "Name is required." })}
      />
      <Input as="textarea" rows={3} label="Description" {...register("description")} />
      <Button type="submit" isLoading={isSubmitting}>
        Save
      </Button>
    </form>
  );
}
