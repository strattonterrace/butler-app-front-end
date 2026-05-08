/**
 * Users API — admin user management endpoints.
 *
 * Endpoint map:
 *   GET   /users/                  → paginated user list (admin)
 *   GET   /users/:id/              → single user (admin)
 *   PATCH /users/:id/              → update user (admin)
 *   POST  /users/create-operator/  → create operator account (admin)
 */
import apiClient from './client'

export const usersApi = {
    list: async ({ role, search, page = 1 } = {}) => {
        const params = {}
        if (role && role !== 'all') params.role = role
        if (search) params.search = search
        if (page > 1) params.page = page
        const { data } = await apiClient.get('/users/', { params })
        return data // { count, next, previous, results: [...] }
    },

    get: async (id) => {
        const { data } = await apiClient.get(`/users/${id}/`)
        return data
    },

    update: async (id, fields) => {
        const { data } = await apiClient.patch(`/users/${id}/`, fields)
        return data
    },

    createOperator: async ({ fullName, email, password, territoryId }) => {
        const payload = { fullName, email, password }
        if (territoryId) payload.territoryId = territoryId
        const { data } = await apiClient.post('/users/create-operator/', payload)
        return data
    },
}
