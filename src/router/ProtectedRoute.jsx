import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const DEFAULT_ROUTES = {
    client: '/dashboard',
    operator: '/operator',
    driver: '/driver',
    admin: '/admin',
}

export function ProtectedRoute({ children, allowedRoles, requireSubscription = false }) {
    const { currentUser, isAuthenticated, isLoading } = useAuthStore()
    const location = useLocation()

    // Still restoring session from localStorage — don't redirect yet
    if (isLoading) return null

    if (!isAuthenticated || !currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        return <Navigate to={DEFAULT_ROUTES[currentUser.role] || '/dashboard'} replace />
    }

    if (requireSubscription && currentUser.role === 'client') {
        const subStatus = currentUser.subscription?.status
        if (subStatus !== 'active') {
            return <Navigate to="/subscribe" replace />
        }
    }

    return children
}
