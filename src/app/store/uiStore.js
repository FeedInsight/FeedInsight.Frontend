import { create } from 'zustand'

const STORAGE_KEY_SESSION = 'feedinsight_active_chat_session_id'

const getInitialSessionId = () => {
  try {
    return localStorage.getItem(STORAGE_KEY_SESSION) || null
  } catch {
    return null
  }
}

export const useUiStore = create((set) => ({
  isSidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),

  activeChatSessionId: getInitialSessionId(),
  setActiveChatSessionId: (id) => {
    try {
      if (id) {
        localStorage.setItem(STORAGE_KEY_SESSION, id)
      } else {
        localStorage.removeItem(STORAGE_KEY_SESSION)
      }
    } catch {
      // Ignore storage errors
    }
    set({ activeChatSessionId: id })
  },

  isChatDrawerOpen: false,
  toggleChatDrawer: () => set((s) => ({ isChatDrawerOpen: !s.isChatDrawerOpen })),
  openChatDrawer: () => set({ isChatDrawerOpen: true }),
  closeChatDrawer: () => set({ isChatDrawerOpen: false }),
}))
