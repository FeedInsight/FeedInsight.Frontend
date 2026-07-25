/**
 * src/components/adminPortal/backlog/StoryCard.jsx
 * ----------------------------------------------------------------------------
 * A single UserStory row in the Backlog Review Workspace list. Clicking it
 * selects the story (dispatch selectStory) so <StoryDetailPanel /> shows it.
 *
 * Props:
 *   - story: { id, title, categoryName, urgencyScore, status, jiraTicketKey }
 *   - isSelected: boolean
 *   - onSelect: (id) => void
 * ----------------------------------------------------------------------------
 */
import React from "react";
import clsx from "clsx";
import Badge from "../../common/Badge/Badge";
import { formatUrgencyLabel } from "../../../utils/formatters";
import { STORY_STATUS } from "../../../utils/constants";
import styles from "./StoryCard.module.css";

const STATUS_TONE = {
  [STORY_STATUS.DRAFT]: "warning",
  [STORY_STATUS.APPROVED]: "success",
  [STORY_STATUS.REJECTED]: "danger",
};

export default function StoryCard({ story, isSelected, onSelect }) {
  return (
    <div
      className={clsx(styles.card, isSelected && styles.selected)}
      onClick={() => onSelect(story.id)}
    >
      <div className={styles.title}>{story.title}</div>
      <div className={styles.meta}>
        <Badge tone={STATUS_TONE[story.status] || "neutral"}>{story.status}</Badge>
        <Badge tone="info">{story.categoryName}</Badge>
        <span className={styles.urgency}>{formatUrgencyLabel(story.urgencyScore)}</span>
        {story.jiraTicketKey && <span className={styles.jiraKey}>{story.jiraTicketKey}</span>}
      </div>
    </div>
  );
}
