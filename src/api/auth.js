/**
 * Auth API — thin wrappers over the Django REST endpoints.
 *
 * Every function either returns parsed response data or throws an axios error
 * that the caller can handle with extractErrorMessage().
 *
 * Endpoint map (all under /api/v1/):
 *   POST  auth/register/             → { access, refresh, user }
 *   POST  auth/login/                → { access, refresh, user }
 *   POST  auth/logout/               → 204
 *   POST  auth/token/refresh/        → { access, refresh? }
 *   POST  auth/password-reset/       → { detail }
 *   POST  auth/password-reset/confirm/ → { detail }
 *   POST  auth/password-change/      → { detail }
 *   GET   users/me/                  → UserSerializer
 *   PATCH users/me/                  → UserSerializer
 */
import apiClient from './client'

export const authApi = {
    register: async ({ fullName, email, password, confirmPassword }) => {
        const { data } = await apiClient.post('/auth/register/', {
            fullName,
            email,
            password,
            confirmPassword,
        })
        return data // { access, refresh, user }
    },

    login: async ({ email, password }) => {
        const { data } = await apiClient.post('/auth/login/', { email, password })
        return data // { access, refresh, user }
    },

    logout: async ({ refresh }) => {
        await apiClient.post('/auth/logout/', { refresh })
    },

    me: async () => {
        const { data } = await apiClient.get('/users/me/')
        return data // UserSerializer
    },

    updateMe: async (fields) => {
        const { data } = await apiClient.patch('/users/me/', fields)
        return data // UserSerializer
    },

    requestPasswordReset: async ({ email }) => {
        const { data } = await apiClient.post('/auth/password-reset/', { email })
        return data // { detail }
    },

    confirmPasswordReset: async ({ uid, token, password, confirmPassword }) => {
        const { data } = await apiClient.post('/auth/password-reset/confirm/', {
            uid,
            token,
            password,
            confirmPassword,
        })
        return data // { detail }
    },

    changePassword: async ({ currentPassword, newPassword, confirmPassword }) => {
        const { data } = await apiClient.post('/auth/password-change/', {
            currentPassword,
            newPassword,
            confirmPassword,
        })
        return data // { detail }
    },
}
