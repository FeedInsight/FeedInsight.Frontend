import { create } from 'zustand'

export const useUiStore = create((set) => ({
  isSidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),

  activeChatSessionId: null,
  setActiveChatSessionId: (id) => set({ activeChatSessionId: id }),
}))
