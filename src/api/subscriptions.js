/**
 * Subscriptions API — Stripe billing endpoints (M2).
 *
 * Endpoint map (all under /api/v1/subscriptions/):
 *   GET  status/           → { status, planAmount, currentPeriodStart, currentPeriodEnd, cancelAtPeriodEnd, cancelledAt }
 *   POST create-checkout/  → { checkoutUrl }   — redirect the browser here
 *   POST cancel/           → updated subscription (cancels at period end)
 *   POST reactivate/       → updated subscription (undoes pending cancel)
 *   POST portal-session/   → { portalUrl }     — Stripe-hosted billing portal
 *
 * A 502 with code PAYMENT_SERVICE_ERROR means Stripe is unreachable or not
 * configured — surface it as "payment service unavailable", not a form error.
 */
import apiClient from './client'

export const subscriptionsApi = {
    status: async () => {
        const { data } = await apiClient.get('/subscriptions/status/')
        return data
    },

    createCheckout: async () => {
        const { data } = await apiClient.post('/subscriptions/create-checkout/')
        return data // { checkoutUrl }
    },

    cancel: async () => {
        const { data } = await apiClient.post('/subscriptions/cancel/')
        return data
    },

    reactivate: async () => {
        const { data } = await apiClient.post('/subscriptions/reactivate/')
        return data
    },

    portalSession: async () => {
        const { data } = await apiClient.post('/subscriptions/portal-session/')
        return data // { portalUrl }
    },
}
