import { create } from 'zustand'
import { authApi } from '@/api/auth'
import { ACCESS_KEY, REFRESH_KEY } from '@/api/client'

export const useAuthStore = create((set, get) => ({
    currentUser: null,
    isAuthenticated: false,
    isLoading: true, // true during session restore on app mount

    /**
     * Called once on app mount. Checks localStorage for an existing session
     * and validates it against /users/me/ before trusting it.
     */
    initialize: async () => {
        const access = localStorage.getItem(ACCESS_KEY)
        const refresh = localStorage.getItem(REFRESH_KEY)

        if (!access || !refresh) {
            set({ isLoading: false })
            return
        }

        try {
            const user = await authApi.me()
            set({ currentUser: user, isAuthenticated: true, isLoading: false })
        } catch {
            // Tokens expired or invalid — clear and let the user log in again
            localStorage.removeItem(ACCESS_KEY)
            localStorage.removeItem(REFRESH_KEY)
            set({ isLoading: false })
        }
    },

    login: async (email, password) => {
        const data = await authApi.login({ email, password })
        localStorage.setItem(ACCESS_KEY, data.access)
        localStorage.setItem(REFRESH_KEY, data.refresh)
        set({ currentUser: data.user, isAuthenticated: true })
        return data.user
    },

    register: async ({ fullName, email, password, confirmPassword }) => {
        const data = await authApi.register({ fullName, email, password, confirmPassword })
        localStorage.setItem(ACCESS_KEY, data.access)
        localStorage.setItem(REFRESH_KEY, data.refresh)
        set({ currentUser: data.user, isAuthenticated: true })
        return data.user
    },

    logout: async () => {
        const refresh = localStorage.getItem(REFRESH_KEY)
        if (refresh) {
            try {
                await authApi.logout({ refresh })
            } catch {
                // Blacklisting failed (token already expired/invalid) — still clear locally
            }
        }
        localStorage.removeItem(ACCESS_KEY)
        localStorage.removeItem(REFRESH_KEY)
        set({ currentUser: null, isAuthenticated: false })
    },

    setUser: (user) => set({ currentUser: user }),
}))

// The axios interceptor in client.js fires this event when the refresh token
// is expired/invalid. We handle it here without a circular import.
if (typeof window !== 'undefined') {
    window.addEventListener('butler:logout', () => {
        useAuthStore.setState({ currentUser: null, isAuthenticated: false })
    })
}
