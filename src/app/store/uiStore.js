import { create } from 'zustand'

const STORAGE_KEY_SESSION = 'feedinsight_active_chat_session_id'
const STORAGE_KEY_THEME = 'feedinsight_theme'

const getInitialSessionId = () => {
  try {
    return localStorage.getItem(STORAGE_KEY_SESSION) || null
  } catch {
    return null
  }
}

const getInitialTheme = () => {
  try {
    const storedTheme = localStorage.getItem(STORAGE_KEY_THEME)
    if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme
  } catch {
    // Ignore storage errors
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useUiStore = create((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () =>
    set((state) => {
      const theme = state.theme === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(STORAGE_KEY_THEME, theme)
      } catch {
        // Ignore storage errors
      }
      return { theme }
    }),

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
