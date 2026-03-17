import { useCallback } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { MobileNav } from './MobileNav'
import { MobileDrawer } from './MobileDrawer'
import { NetworkStatus } from './NetworkStatus'
import { useAuthStore } from '@/store/authStore'
import { useSessionTimeout } from '@/hooks/useEdgeCases'

export function AppShell() {
    const { logout } = useAuthStore()
    const navigate = useNavigate()

    const handleSessionExpiry = useCallback(() => {
        toast.error('Session expired', { description: 'You were logged out due to inactivity.' })
        logout()
        navigate('/login')
    }, [logout, navigate])

    useSessionTimeout(handleSessionExpiry, 30 * 60 * 1000) // 30 min

    return (
        <div className="app-shell">
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <TopBar />
                <main id="main-content" className="app-main" role="main" aria-label="Page content">
                    <Outlet />
                </main>
            </div>
            <MobileNav />
            <MobileDrawer />
            <NetworkStatus />
        </div>
    )
}
