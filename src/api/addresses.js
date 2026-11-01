/**
 * Saved Addresses API — the client's personal address book.
 *
 * Endpoint map (all under /api/v1/users/me/addresses/):
 *   GET    /                → plain array of { id, label, address, isDefault, ... }
 *   POST   /                → create → the new address
 *   PATCH  /:id/            → update (label / address / isDefault) → the address
 *   DELETE /:id/            → 204
 *
 * The list is a plain array (an address book is small — no pagination).
 */
import apiClient from './client'

export const addressesApi = {
    list: async () => {
        const { data } = await apiClient.get('/users/me/addresses/')
        return data // [{ id, label, address, isDefault, createdAt, updatedAt }]
    },

    create: async ({ label, address, isDefault = false }) => {
        const { data } = await apiClient.post('/users/me/addresses/', { label, address, isDefault })
        return data
    },

    update: async (id, fields) => {
        const { data } = await apiClient.patch(`/users/me/addresses/${id}/`, fields)
        return data
    },

    remove: async (id) => {
        await apiClient.delete(`/users/me/addresses/${id}/`)
    },
}
