/**
 * src/components/adminPortal/backlog/AcceptanceCriteriaEditor.jsx
 * ----------------------------------------------------------------------------
 * Editable "Given-When-Then" acceptance criteria text area (README: "maps
 * requirements into Given-When-Then criteria").
 *
 * Props:
 *   - storyId: string
 *   - value: string (current AcceptanceCriteria)
 *
 * Behavior:
 *   - Local editable copy of `value`; a "Save" button dispatches
 *     updateCriteriaThunk({ id: storyId, acceptanceCriteria }) only when
 *     dirty, to avoid needless writes.
 *   - TODO: consider a structured Given/When/Then multi-field editor instead
 *     of a single free-text textarea, once the exact backend field format
 *     (plain text vs structured JSON) is confirmed.
 * ----------------------------------------------------------------------------
 */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateCriteriaThunk } from "../../../store/slices/storiesSlice";
import { useToast } from "../../../context/ToastContext";
import Input from "../../common/Input/Input";
import Button from "../../common/Button/Button";

export default function AcceptanceCriteriaEditor({ storyId, value }) {
  const [draft, setDraft] = useState(value || "");
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const isDirty = draft !== value;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await dispatch(
        updateCriteriaThunk({ id: storyId, acceptanceCriteria: draft })
      ).unwrap();
      showToast({ type: "success", message: "Acceptance criteria updated." });
    } catch (err) {
      showToast({ type: "error", message: err.message || "Could not save changes." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <Input
        as="textarea"
        rows={8}
        label="Acceptance Criteria (Given / When / Then)"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />
      <Button onClick={handleSave} isLoading={isSaving} disabled={!isDirty}>
        Save changes
      </Button>
    </div>
  );
}
