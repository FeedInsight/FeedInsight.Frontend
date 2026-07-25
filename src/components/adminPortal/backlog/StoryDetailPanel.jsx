/**
 * src/components/adminPortal/backlog/StoryDetailPanel.jsx
 * ----------------------------------------------------------------------------
 * Right-hand detail panel of the Backlog Review Workspace (README:
 * "side-by-side analysis of AI-drafted user stories, dynamic urgency
 * scores, and duplicate matching vectors").
 *
 * Props:
 *   - storyId: string | null — if null, render an empty-state prompt instead
 *
 * Responsibilities:
 *   - Read the full story object from state.stories.items (found by storyId).
 *   - On mount/storyId change, dispatch loadDuplicates(storyId).
 *   - Compose: title/category/urgency header, <AcceptanceCriteriaEditor />,
 *     list of <DuplicateMatchBadge /> (from state.stories.duplicates[storyId]),
 *     <ApproveRejectActions />.
 * ----------------------------------------------------------------------------
 */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadDuplicates } from "../../../store/slices/storiesSlice";
import Card from "../../common/Card/Card";
import Badge from "../../common/Badge/Badge";
import EmptyState from "../../common/EmptyState/EmptyState";
import AcceptanceCriteriaEditor from "./AcceptanceCriteriaEditor";
import DuplicateMatchBadge from "./DuplicateMatchBadge";
import ApproveRejectActions from "./ApproveRejectActions";
import { formatUrgencyLabel } from "../../../utils/formatters";

export default function StoryDetailPanel({ storyId }) {
  const dispatch = useDispatch();
  const story = useSelector((state) => state.stories.items.find((s) => s.id === storyId));
  const duplicates = useSelector((state) => state.stories.duplicates[storyId] || []);

  useEffect(() => {
    if (storyId) {
      dispatch(loadDuplicates(storyId));
    }
  }, [storyId, dispatch]);

  if (!storyId || !story) {
    return <EmptyState message="Select a story from the list to review it." />;
  }

  return (
    <div>
      <Card
        title={story.title}
        actions={<Badge tone="info">{formatUrgencyLabel(story.urgencyScore)} urgency</Badge>}
      >
        <AcceptanceCriteriaEditor storyId={story.id} value={story.acceptanceCriteria} />

        {duplicates.length > 0 && (
          <div>
            <h4>Possible duplicates</h4>
            {duplicates.map((match) => (
              <DuplicateMatchBadge
                key={match.storyId}
                match={match}
                onView={() => {
                  /* TODO: dispatch(selectStory(match.storyId)) to jump panels */
                }}
              />
            ))}
          </div>
        )}

        <ApproveRejectActions story={story} />
      </Card>
    </div>
  );
}
