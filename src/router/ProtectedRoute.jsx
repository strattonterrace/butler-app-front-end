import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

/**
 * ProtectedRoute — wraps children and enforces:
 * 1. Authentication check  (unauthenticated → /login)
 * 2. Required role check   (wrong role → default dashboard for their role)
 * 3. Subscription check    (client without active sub → /subscribe)
 */

const DEFAULT_ROUTES = {
    client: '/dashboard',
    operator: '/operator',
    driver: '/driver',
    admin: '/admin',
}

export function ProtectedRoute({ children, allowedRoles, requireSubscription = false }) {
    const { currentUser, isAuthenticated } = useAuthStore()
    const location = useLocation()

    // 1. Not logged in → login page
    if (!isAuthenticated || !currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // 2. Role check
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        return <Navigate to={DEFAULT_ROUTES[currentUser.role] || '/dashboard'} replace />
    }

    // 3. Subscription check (client only)
    if (requireSubscription && currentUser.role === 'client') {
        const subStatus = currentUser.subscription?.status
        if (subStatus !== 'active') {
            return <Navigate to="/subscribe" replace />
        }
    }

    return children
}
