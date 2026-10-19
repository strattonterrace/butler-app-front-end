import { create } from 'zustand'

const getInitialTheme = () => {
    try {
        return localStorage.getItem('butler-theme') || 'dark'
    } catch {
        return 'dark'
    }
}

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

    toggleTheme: () => set((s) => {
        const next = s.theme === 'dark' ? 'light' : 'dark'
        applyTheme(next)
        return { theme: next }
    }),
}))

