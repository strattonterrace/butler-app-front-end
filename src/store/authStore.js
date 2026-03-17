import { create } from 'zustand'

// Mock users for Phase 1 — switch between roles for development
const MOCK_USERS = {
    client: {
        id: 'usr_001',
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        role: 'client',
        phone: '+1 (949) 555-0101',
        avatar: null,
        status: 'active',
        subscription: {
            status: 'active',
            startDate: '2026-01-15',
            nextBilling: '2026-03-15',
            plan: '$199/month',
        },
        createdAt: '2026-01-15T10:30:00Z',
    },
    operator: {
        id: 'usr_005',
        fullName: 'Alex Rivera',
        email: 'alex@butler.com',
        role: 'operator',
        phone: '+1 (949) 555-0505',
        avatar: null,
        status: 'active',
        subscription: null,
        createdAt: '2025-12-01T09:00:00Z',
    },
    driver: {
        id: 'usr_010',
        fullName: 'Marcus Johnson',
        email: 'marcus@example.com',
        role: 'driver',
        phone: '+1 (949) 555-1010',
        avatar: null,
        status: 'active',
        subscription: null,
        vehicle: { make: 'Toyota', model: 'Camry', year: 2022, plate: '7ABC123' },
        availability: { days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], hours: 'flexible' },
        approvalStatus: 'approved',
        createdAt: '2026-01-20T14:00:00Z',
    },
    admin: {
        id: 'usr_020',
        fullName: 'Ryan Mitchell',
        email: 'ryan@butler.com',
        role: 'admin',
        phone: '+1 (949) 555-2020',
        avatar: null,
        status: 'active',
        subscription: null,
        createdAt: '2025-11-01T08:00:00Z',
    },
}

export const useAuthStore = create((set) => ({
    currentUser: MOCK_USERS.client,
    isAuthenticated: true,

    login: (role) => set({
        currentUser: MOCK_USERS[role],
        isAuthenticated: true,
    }),

    logout: () => set({
        currentUser: null,
        isAuthenticated: false,
    }),

    switchRole: (role) => set({
        currentUser: MOCK_USERS[role],
    }),
}))
