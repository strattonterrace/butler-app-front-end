/**
 * Axios instance — single HTTP boundary for the entire frontend.
 *
 * Responsibilities:
 *   1. Attach the JWT access token to every outgoing request.
 *   2. On 401: attempt a silent token refresh, then retry the original request.
 *   3. On refresh failure: clear tokens and fire 'butler:logout' so the auth
 *      store can clean up state without a circular import.
 *
 * Token storage keys are exported so authStore can write to the same slots.
 */
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

export const ACCESS_KEY = 'butler_access'
export const REFRESH_KEY = 'butler_refresh'

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
})

// ── Request: attach Bearer token ─────────────────────────────────────────────
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(ACCESS_KEY)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// ── Response: silent refresh on 401 ──────────────────────────────────────────
let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
    failedQueue.forEach(({ resolve, reject }) =>
        error ? reject(error) : resolve(token)
    )
    failedQueue = []
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config

        if (error.response?.status !== 401 || original._retry) {
            return Promise.reject(error)
        }

        // The refresh endpoint itself returned 401 — session is dead
        if (original.url?.includes('/auth/token/refresh')) {
            processQueue(error)
            _forceLogout()
            return Promise.reject(error)
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject })
            }).then((token) => {
                original.headers.Authorization = `Bearer ${token}`
                return apiClient(original)
            })
        }

        original._retry = true
        isRefreshing = true

        const refresh = localStorage.getItem(REFRESH_KEY)
        if (!refresh) {
            processQueue(error)
            _forceLogout()
            isRefreshing = false
            return Promise.reject(error)
        }

        try {
            const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh })
            localStorage.setItem(ACCESS_KEY, data.access)
            if (data.refresh) localStorage.setItem(REFRESH_KEY, data.refresh)
            processQueue(null, data.access)
            original.headers.Authorization = `Bearer ${data.access}`
            return apiClient(original)
        } catch (refreshError) {
            processQueue(refreshError)
            _forceLogout()
            return Promise.reject(refreshError)
        } finally {
            isRefreshing = false
        }
    }
)

function _forceLogout() {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    window.dispatchEvent(new CustomEvent('butler:logout'))
}

/**
 * Extract a single user-facing error string from any DRF error shape.
 *
 * DRF can return:
 *   { detail: "..." }
 *   { email: ["already exists"] }
 *   { non_field_errors: ["..."] }
 *   { status: "error", message: "...", errors: {...} }  ← our custom handler
 */
export function extractErrorMessage(error) {
    const data = error.response?.data
    if (!data) return error.message || 'An unexpected error occurred.'

    if (typeof data.message === 'string') return data.message
    if (typeof data.detail === 'string') return data.detail

    const values = Object.values(data).flat()
    if (values.length) return String(values[0])

    return 'An unexpected error occurred.'
}

export default apiClient
