/**
 * src/components/adminPortal/backlog/DuplicateMatchBadge.jsx
 * ----------------------------------------------------------------------------
 * Renders one Qdrant duplicate match result (README: "flags duplicate
 * tickets instantly using semantic vector search"). Rendered in a list
 * inside <StoryDetailPanel />.
 *
 * Props:
 *   - match: { storyId, title, similarityScore }
 *   - onView: (storyId) => void — jumps the detail panel to that story
 * ----------------------------------------------------------------------------
 */
import React from "react";
import Badge from "../../common/Badge/Badge";
import { formatSimilarityScore } from "../../../utils/formatters";
import styles from "./DuplicateMatchBadge.module.css";

export default function DuplicateMatchBadge({ match, onView }) {
  return (
    <div className={styles.row} onClick={() => onView(match.storyId)}>
      <span className={styles.title}>{match.title}</span>
      <Badge tone="warning">{formatSimilarityScore(match.similarityScore)} match</Badge>
    </div>
  );
}
