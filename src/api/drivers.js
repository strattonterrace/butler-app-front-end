/**
 * Drivers API — application + approval endpoints (M2 §11).
 *
 * Endpoint map (all under /api/v1/drivers/):
 *   POST /drivers/apply/               → become a pending driver
 *   GET  /drivers/application-status/  → { approvalStatus, rejectionReason, appliedAt }
 *   GET  /drivers/available/           → approved drivers for assignment (plain array,
 *                                        least-busy-first, territory-scoped for operators)
 *   GET  /drivers/pending/             → pending applications for admin review (plain array)
 *   POST /drivers/:id/approve/         → approve — :id is the driver's USER id
 *   POST /drivers/:id/reject/          → reject with a reason — :id is the driver's USER id
 *
 * These are plain (non-paginated) endpoints — no envelope to unwrap.
 */
import apiClient from './client'

export const driversApi = {
    apply: async (payload) => {
        const { data } = await apiClient.post('/drivers/apply/', payload)
        return data
    },

    applicationStatus: async () => {
        const { data } = await apiClient.get('/drivers/application-status/')
        return data
    },

    available: async () => {
        const { data } = await apiClient.get('/drivers/available/')
        return data // array
    },

    pending: async () => {
        const { data } = await apiClient.get('/drivers/pending/')
        return data // array
    },

    approve: async (userId) => {
        const { data } = await apiClient.post(`/drivers/${userId}/approve/`)
        return data
    },

    reject: async (userId, reason = '') => {
        const { data } = await apiClient.post(`/drivers/${userId}/reject/`, { reason })
        return data
    },
}
