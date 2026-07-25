import { create } from 'zustand'

// NOTE: Light mode is temporarily disabled until the M3 theming pass.
// Many components hard-code dark-theme colors inline (which CSS can't
// override), so light mode has unreadable text. Forcing dark keeps the
// polished experience consistent. To re-enable in M3: restore the
// localStorage read below and un-hide the toggle in Sidebar/MobileDrawer.
const getInitialTheme = () => 'dark'

const applyTheme = (theme) => {
    if (theme === 'light') {
        document.documentElement.classList.add('light')
    } else {
        document.documentElement.classList.remove('light')
    }
    try { localStorage.setItem('butler-theme', theme) } catch { /* noop */ }
}

// Apply on load immediately (before first render)
applyTheme(getInitialTheme())

export const useUIStore = create((set) => ({
    sidebarCollapsed: false,
    mobileNavOpen: false,
    theme: getInitialTheme(),

    toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
    setMobileNavOpen: (v) => set({ mobileNavOpen: v }),

    toggleTheme: () => set(() => {
        // Light mode disabled until the M3 theming pass — always stay dark.
        applyTheme('dark')
        return { theme: 'dark' }
    }),
}))

