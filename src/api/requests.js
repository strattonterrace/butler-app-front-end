/**
 * Requests API — service-request lifecycle endpoints (M2 §10).
 *
 * Endpoint map (all under /api/v1/requests/):
 *   GET   /requests/            → paginated list, role-scoped by the backend
 *   POST  /requests/            → client creates a request → returns full detail
 *   GET   /requests/:id/        → full detail + parties + status timeline
 *   PATCH /requests/:id/status/ → transition the lifecycle (assign/start/complete/cancel)
 *   GET   /requests/:id/history/→ status audit timeline (flat array)
 *   GET   /requests/stats/      → role-shaped dashboard counters
 *
 * The list endpoint is wrapped in the pagination envelope
 *   { status, data: { results, count, next, previous } }
 * so `list()` unwraps it and hands back a flat { results, count, ... }.
 * Every other endpoint returns its object/array directly.
 */
import apiClient from './client'

export const requestsApi = {
    list: async (params = {}) => {
        const query = {}
        if (params.status && params.status !== 'all') query.status = params.status
        if (params.serviceType) query.service_type = params.serviceType
        if (params.urgency) query.urgency = params.urgency
        if (params.client) query.client = params.client
        if (params.search) query.search = params.search
        if (params.ordering) query.ordering = params.ordering
        if (params.page > 1) query.page = params.page
        const { data } = await apiClient.get('/requests/', { params: query })
        // Unwrap the pagination envelope → flat { results, count, next, previous }
        return data.data ?? data
    },

    get: async (id) => {
        const { data } = await apiClient.get(`/requests/${id}/`)
        return data
    },

    create: async (payload) => {
        const { data } = await apiClient.post('/requests/', payload)
        return data // full detail (201)
    },

    transition: async (id, body) => {
        const { data } = await apiClient.patch(`/requests/${id}/status/`, body)
        return data // updated detail
    },

    history: async (id) => {
        const { data } = await apiClient.get(`/requests/${id}/history/`)
        return data // flat array
    },

    stats: async () => {
        const { data } = await apiClient.get('/requests/stats/')
        return data
    },
}
