import { create } from 'zustand'

export const useUIStore = create((set) => ({
    sidebarCollapsed: false,
    mobileNavOpen: false,

    toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
    setMobileNavOpen: (v) => set({ mobileNavOpen: v }),
}))
