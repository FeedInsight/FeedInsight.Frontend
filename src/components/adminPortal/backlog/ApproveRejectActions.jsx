/**
 * src/components/adminPortal/backlog/ApproveRejectActions.jsx
 * ----------------------------------------------------------------------------
 * Approve / Reject action buttons for a Draft story (README: "before
 * manually confirming Jira publication"). Only rendered when
 * story.status === STORY_STATUS.DRAFT.
 *
 * Props:
 *   - story: { id, status }
 * ----------------------------------------------------------------------------
 */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { approveStoryThunk, rejectStoryThunk } from "../../../store/slices/storiesSlice";
import { useToast } from "../../../context/ToastContext";
import { STORY_STATUS } from "../../../utils/constants";
import Button from "../../common/Button/Button";
import styles from "./ApproveRejectActions.module.css";

export default function ApproveRejectActions({ story }) {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  if (story.status !== STORY_STATUS.DRAFT) return null;

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await dispatch(approveStoryThunk(story.id)).unwrap();
      showToast({ type: "success", message: "Story approved and published to Jira." });
    } catch (err) {
      showToast({ type: "error", message: err.message || "Could not approve story." });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    // TODO: replace prompt() with a proper Modal + Input for the rejection reason
    const reason = window.prompt("Reason for rejecting this story?");
    if (reason === null) return;
    setIsRejecting(true);
    try {
      await dispatch(rejectStoryThunk({ id: story.id, reason })).unwrap();
    } catch (err) {
      showToast({ type: "error", message: err.message || "Could not reject story." });
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className={styles.actions}>
      <Button onClick={handleApprove} isLoading={isApproving}>
        Approve & Publish to Jira
      </Button>
      <Button variant="danger" onClick={handleReject} isLoading={isRejecting}>
        Reject
      </Button>
    </div>
  );
}
