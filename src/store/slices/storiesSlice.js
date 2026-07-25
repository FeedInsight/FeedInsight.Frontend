/**
 * src/store/slices/storiesSlice.js
 * ----------------------------------------------------------------------------
 * Owns the UserStories domain — the Backlog Review Workspace.
 *
 * State shape:
 *   {
 *     items: Array<UserStory>,
 *     totalCount: number,
 *     selectedStoryId: string | null,
 *     duplicates: Record<storyId, Array<{ storyId, title, similarityScore }>>,
 *     status: 'idle' | 'loading' | 'succeeded' | 'failed',
 *     error: string | null
 *   }
 *
 * Consumed by:
 *   - src/pages/admin/BacklogReviewPage.jsx (dispatch loadStories with filters/pagination)
 *   - src/components/adminPortal/backlog/StoryCard.jsx (read from `items`)
 *   - src/components/adminPortal/backlog/StoryDetailPanel.jsx (dispatch
 *     approve/reject/updateCriteria, read `selectedStoryId`)
 *   - src/components/adminPortal/backlog/DuplicateMatchBadge.jsx (read `duplicates`)
 * ----------------------------------------------------------------------------
 */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as storiesApi from "../../api/storiesApi";

export const loadStories = createAsyncThunk("stories/load", async (params) => {
  return storiesApi.fetchStories(params);
});

export const loadDuplicates = createAsyncThunk("stories/loadDuplicates", async (storyId) => {
  const matches = await storiesApi.fetchDuplicateMatches(storyId);
  return { storyId, matches };
});

export const approveStoryThunk = createAsyncThunk("stories/approve", async (id) => {
  return storiesApi.approveStory(id);
});

export const rejectStoryThunk = createAsyncThunk("stories/reject", async ({ id, reason }) => {
  return storiesApi.rejectStory(id, reason);
});

export const updateCriteriaThunk = createAsyncThunk(
  "stories/updateCriteria",
  async ({ id, acceptanceCriteria }) => {
    return storiesApi.updateAcceptanceCriteria(id, acceptanceCriteria);
  }
);

const storiesSlice = createSlice({
  name: "stories",
  initialState: {
    items: [],
    totalCount: 0,
    selectedStoryId: null,
    duplicates: {},
    status: "idle",
    error: null,
  },
  reducers: {
    selectStory(state, action) {
      state.selectedStoryId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadStories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadStories.fulfilled, (state, action) => {
        state.status = "succeeded";
        // TODO: confirm actual API envelope — assumed { items, totalCount }
        state.items = action.payload.items;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(loadStories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(loadDuplicates.fulfilled, (state, action) => {
        state.duplicates[action.payload.storyId] = action.payload.matches;
      })
      .addCase(approveStoryThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(rejectStoryThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateCriteriaThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export const { selectStory } = storiesSlice.actions;
export default storiesSlice.reducer;
