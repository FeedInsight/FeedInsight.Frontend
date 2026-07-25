/**
 * src/store/store.js
 * ----------------------------------------------------------------------------
 * Redux Toolkit store configuration. Combines every slice under
 * src/store/slices/. Add new slices here AND in the import list — nowhere
 * else should configureStore be called.
 * ----------------------------------------------------------------------------
 */
import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "./slices/categoriesSlice";
import storiesReducer from "./slices/storiesSlice";
import chatReducer from "./slices/chatSlice";
import analyticsReducer from "./slices/analyticsSlice";

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    stories: storiesReducer,
    chat: chatReducer,
    analytics: analyticsReducer,
  },
  // TODO: add middleware for error-toast side effects (e.g. rtk-listener that
  // calls useToast's showToast when any thunk is *.rejected), or handle that
  // per-component instead if simpler.
});

export default store;
