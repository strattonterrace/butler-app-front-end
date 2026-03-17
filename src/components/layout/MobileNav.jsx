import { NavLink } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { House, Plus, ClockCounterClockwise, Queue, ListChecks, UsersThree, Gear } from '@phosphor-icons/react'

const MOBILE_NAV = {
    client: [
        { to: '/dashboard', label: 'Home', icon: House },
        { to: '/requests/new', label: 'New', icon: Plus },
        { to: '/requests', label: 'Requests', icon: ClockCounterClockwise },
        { to: '/settings', label: 'Settings', icon: Gear },
    ],
    operator: [
        { to: '/operator', label: 'Home', icon: House },
        { to: '/operator/queue', label: 'Queue', icon: Queue },
        { to: '/operator/active', label: 'Active', icon: ListChecks },
    ],
    driver: [
        { to: '/driver', label: 'Home', icon: House },
        { to: '/driver/tasks', label: 'Tasks', icon: ListChecks },
        { to: '/driver/completed', label: 'Done', icon: ClockCounterClockwise },
        { to: '/driver/settings', label: 'Settings', icon: Gear },
    ],
    admin: [
        { to: '/admin', label: 'Home', icon: House },
        { to: '/admin/requests', label: 'Requests', icon: Queue },
        { to: '/admin/users', label: 'Users', icon: UsersThree },
        { to: '/admin/revenue', label: 'Revenue', icon: ListChecks },
    ],
}

export function MobileNav() {
    const { currentUser } = useAuthStore()
    const role = currentUser?.role || 'client'
    const items = MOBILE_NAV[role] || MOBILE_NAV.client

    return (
        <nav className="mobile-nav" aria-label="Mobile navigation" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: 60 }}>
                {items.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={['/dashboard', '/operator', '/driver', '/admin'].includes(item.to)}
                        style={({ isActive }) => ({
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                            padding: '4px 0', fontSize: 10, fontWeight: 500, textDecoration: 'none',
                            color: isActive ? '#C9A84C' : '#71717A', transition: 'color 150ms',
                            minWidth: 0, flex: 1,
                        })}
                    >
                        <item.icon size={20} weight="regular" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    )
}

