/**
 * Admin API — analytics + user-action endpoints (M2 §12).
 *
 * Endpoint map (all under /api/v1/admin/):
 *   GET  /admin/metrics/                  → dashboard overview counters + MRR + churn
 *   GET  /admin/revenue/                  → { monthly: [...6], summary: {...} }
 *   GET  /admin/activity/?limit=20        → recent activity feed (plain array, newest-first)
 *   POST /admin/users/:id/suspend/        → suspend (cancels Stripe sub / unassigns driver jobs)
 *   POST /admin/users/:id/reactivate/     → restore a suspended account
 *
 * NOTE (honest scope): revenue is proxy-derived — MRR from active Subscription
 * rows, lifetime from counting invoice.payment_succeeded webhook events × $199.
 * There is no CAC/LTV/ARR/dispute-rate on the backend; pages must not render
 * those as real numbers.
 */
import apiClient from './client'

export const adminApi = {
    metrics: async () => {
        const { data } = await apiClient.get('/admin/metrics/')
        return data
    },

    revenue: async () => {
        const { data } = await apiClient.get('/admin/revenue/')
        return data // { monthly: [...], summary: {...} }
    },

    activity: async (limit = 20) => {
        const { data } = await apiClient.get('/admin/activity/', { params: { limit } })
        return data // array
    },

    suspendUser: async (userId) => {
        const { data } = await apiClient.post(`/admin/users/${userId}/suspend/`)
        return data
    },

    reactivateUser: async (userId) => {
        const { data } = await apiClient.post(`/admin/users/${userId}/reactivate/`)
        return data
    },
}
