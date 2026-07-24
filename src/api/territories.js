/**
 * Territories API — public onboarding location gate + waitlist.
 *
 * Endpoint map (all under /api/v1/territories/, all public):
 *   GET  /served/          → [{ id, name }]  — active service areas
 *   GET  /check/?zip=92618 → { served, territory: { id, name } | null }
 *   POST /waitlist/        → capture an out-of-area signup
 */
import apiClient from './client'

export const territoriesApi = {
    served: async () => {
        const { data } = await apiClient.get('/territories/served/')
        return data // array
    },

    check: async (zip) => {
        const { data } = await apiClient.get('/territories/check/', { params: { zip } })
        return data // { served, territory }
    },

    joinWaitlist: async ({ email, zipCode, fullName = '', note = '' }) => {
        const { data } = await apiClient.post('/territories/waitlist/', {
            email, zipCode, fullName, note,
        })
        return data
    },
}
