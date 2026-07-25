/**
 * src/store/slices/categoriesSlice.js
 * ----------------------------------------------------------------------------
 * Owns the Categories domain (Dynamic Category Management). This is the ONLY
 * place that mutates `state.categories` — components dispatch these thunks,
 * never write to this slice's state directly.
 *
 * State shape:
 *   {
 *     items: Array<{ id, name, description }>,
 *     status: 'idle' | 'loading' | 'succeeded' | 'failed',
 *     error: string | null
 *   }
 *
 * Consumed by:
 *   - src/components/adminPortal/categories/CategoryList.jsx (read `items`)
 *   - src/components/adminPortal/categories/CategoryForm.jsx (dispatch create/update)
 *   - src/components/adminPortal/backlog/* (read `items` to render category
 *     filters/labels — read-only there)
 * ----------------------------------------------------------------------------
 */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as categoriesApi from "../../api/categoriesApi";

export const loadCategories = createAsyncThunk("categories/load", async () => {
  return categoriesApi.fetchCategories();
});

export const addCategory = createAsyncThunk("categories/add", async (payload) => {
  return categoriesApi.createCategory(payload);
});

export const editCategory = createAsyncThunk("categories/edit", async ({ id, payload }) => {
  return categoriesApi.updateCategory(id, payload);
});

export const removeCategory = createAsyncThunk("categories/remove", async (id) => {
  await categoriesApi.deleteCategory(id);
  return id;
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(removeCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
    // TODO: add .rejected handlers for add/edit/remove to surface errors via
    // component-level `useToast` after awaiting the dispatched thunk.
  },
});

export default categoriesSlice.reducer;
