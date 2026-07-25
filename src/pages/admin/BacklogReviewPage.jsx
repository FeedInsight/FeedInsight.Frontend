/**
 * src/pages/admin/BacklogReviewPage.jsx
 * ----------------------------------------------------------------------------
 * Route: /admin/backlog and /admin/backlog/:storyId. The full "Backlog
 * Review Workspace" page from the README.
 *
 * Responsibilities:
 *   - Read :storyId from useParams(); if present, treat it as the selected
 *     story (keeps deep-linking possible) and dispatch(selectStory(storyId)).
 *   - Own filter state (status, categoryId, search) + usePagination(); pass
 *     as params to loadStories thunk (re-dispatch on filter/page change —
 *     debounce the free-text search via useDebounce).
 *   - Two-column layout: left = filter bar + <StoryCard> list + <Pagination>,
 *     right = <StoryDetailPanel storyId={selectedStoryId} />.
 * ----------------------------------------------------------------------------
 */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadStories, selectStory } from "../../store/slices/storiesSlice";
import usePagination from "../../hooks/usePagination";
import useDebounce from "../../hooks/useDebounce";
import PATHS from "../../routes/routePaths";
import StoryCard from "../../components/adminPortal/backlog/StoryCard";
import StoryDetailPanel from "../../components/adminPortal/backlog/StoryDetailPanel";
import Pagination from "../../components/common/Pagination/Pagination";
import Input from "../../components/common/Input/Input";
import styles from "./BacklogReviewPage.module.css";

export default function BacklogReviewPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalCount, selectedStoryId } = useSelector((state) => state.stories);
  const { page, pageSize, goToNextPage, goToPreviousPage, paginationParams } = usePagination();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    if (storyId) dispatch(selectStory(storyId));
  }, [storyId, dispatch]);

  useEffect(() => {
    // TODO: add status/categoryId filters once filter UI is built
    dispatch(loadStories({ ...paginationParams, search: debouncedSearch }));
  }, [dispatch, paginationParams, debouncedSearch]);

  const handleSelect = (id) => {
    dispatch(selectStory(id));
    navigate(PATHS.ADMIN_BACKLOG_STORY(id));
  };

  return (
    <div className={styles.layout}>
      <div className={styles.listColumn}>
        <h1>Backlog Review</h1>
        <Input
          placeholder="Search stories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {items.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            isSelected={story.id === selectedStoryId}
            onSelect={handleSelect}
          />
        ))}
        <Pagination
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onNext={goToNextPage}
          onPrevious={goToPreviousPage}
        />
      </div>
      <div className={styles.detailColumn}>
        <StoryDetailPanel storyId={selectedStoryId} />
      </div>
    </div>
  );
}
