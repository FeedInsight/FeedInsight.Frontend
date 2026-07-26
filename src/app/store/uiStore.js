import { create } from 'zustand'

/**
 * Ephemeral, non-persisted UI state shared across Admin Portal screens.
 * Anything that should survive a refresh belongs in a persisted store
 * (authStore) instead. Anything that is server data belongs in React Query,
 * not here.
 */
export const useUiStore = create((set) => ({
  isSidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),

  // Tracks which chat session is open in the AI Product Assistant so the
  // ChatSessionList and ChatWindow (features/chat) stay in sync without
  // prop-drilling through AssistantPage.
  activeChatSessionId: null,
  setActiveChatSessionId: (id) => set({ activeChatSessionId: id }),
}))
