import { NavLink } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { cn } from '@/lib/utils'
import {
    House, Plus, ClockCounterClockwise, Gear, Queue, ListChecks,
    UsersThree, Car, ChartBar, CreditCard, CaretLeft, Sun, Moon,
} from '@phosphor-icons/react'

const NAV_ITEMS = {
    client: [
        { to: '/dashboard', label: 'Dashboard', icon: House },
        { to: '/requests/new', label: 'New Request', icon: Plus },
        { to: '/requests', label: 'My Requests', icon: ClockCounterClockwise },
        { to: '/settings', label: 'Settings', icon: Gear },
    ],
    operator: [
        { to: '/operator', label: 'Dashboard', icon: House },
        { to: '/operator/queue', label: 'Request Queue', icon: Queue },
        { to: '/operator/active', label: 'Active Tasks', icon: ListChecks },
    ],
    driver: [
        { to: '/driver', label: 'Dashboard', icon: House },
        { to: '/driver/tasks', label: 'My Tasks', icon: ListChecks },
        { to: '/driver/completed', label: 'Completed', icon: ClockCounterClockwise },
        { to: '/driver/settings', label: 'Settings', icon: Gear },
    ],
    admin: [
        { to: '/admin', label: 'Dashboard', icon: House },
        { to: '/admin/requests', label: 'All Requests', icon: Queue },
        { to: '/admin/users', label: 'Users', icon: UsersThree },
        { to: '/admin/drivers', label: 'Drivers', icon: Car },
        { to: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
        { to: '/admin/revenue', label: 'Revenue', icon: ChartBar },
        { to: '/admin/settings', label: 'Settings', icon: Gear },
    ],
}

export function Sidebar() {
    const { currentUser } = useAuthStore()
    const { sidebarCollapsed, toggleSidebar, theme, toggleTheme } = useUIStore()
    const role = currentUser?.role || 'client'
    const items = NAV_ITEMS[role] || NAV_ITEMS.client
    const isLight = theme === 'light'

    return (
        <aside className={cn('app-sidebar', sidebarCollapsed ? 'app-sidebar--collapsed' : 'app-sidebar--expanded')}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', height: 64, borderBottom: '1px solid #27272A', padding: sidebarCollapsed ? '0' : '0 24px', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
                <img src="/images/butlerlogo.png" alt="Butler" style={{ height: sidebarCollapsed ? 32 : 40, objectFit: 'contain' }} />
            </div>

            {/* Nav */}
            <nav aria-label="Main navigation" style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
                {items.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={['/dashboard', '/operator', '/driver', '/admin'].includes(item.to)}
                        style={({ isActive }) => ({
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: sidebarCollapsed ? '10px 0' : '10px 16px',
                            borderRadius: 10, fontSize: 14, fontWeight: 500,
                            textDecoration: 'none', transition: 'all 150ms',
                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                            backgroundColor: isActive ? 'rgba(201,168,76,0.1)' : 'transparent',
                            color: isActive ? '#C9A84C' : '#A1A1AA',
                        })}
                    >
                        <item.icon size={20} weight="regular" style={{ flexShrink: 0 }} />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Theme Toggle */}
            <div style={{ borderTop: '1px solid #27272A', padding: 12 }}>
                <button
                    onClick={toggleTheme}
                    title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                        padding: '8px 16px', borderRadius: 8, fontSize: 14, border: 'none',
                        cursor: 'pointer', backgroundColor: 'transparent',
                        color: isLight ? '#78716C' : '#71717A',
                        justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                        transition: 'all 150ms',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isLight ? '#E8E8E8' : '#1A1A1F'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    {isLight
                        ? <Moon size={16} weight="bold" />
                        : <Sun size={16} weight="bold" />}
                    {!sidebarCollapsed && (
                        <span>{isLight ? 'Dark Mode' : 'Light Mode'}</span>
                    )}
                </button>
            </div>

            {/* Collapse */}
            <div style={{ borderTop: '1px solid #27272A', padding: 12 }}>
                <button onClick={toggleSidebar}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                        padding: '8px 16px', borderRadius: 8, fontSize: 14, border: 'none',
                        cursor: 'pointer', backgroundColor: 'transparent', color: '#71717A',
                        justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                        transition: 'all 150ms',
                    }}
                >
                    <CaretLeft size={16} weight="bold" style={{ transform: sidebarCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
                    {!sidebarCollapsed && <span>Collapse</span>}
                </button>
            </div>

            {/* User */}
            <div style={{ borderTop: '1px solid #27272A', padding: 16, display: 'flex', alignItems: 'center', gap: 12, justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
                <div style={{
                    width: 36, height: 36, borderRadius: '50%', backgroundColor: '#1A1A1F',
                    border: '1px solid #27272A', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 600, color: '#A1A1AA', flexShrink: 0,
                }}>
                    {currentUser?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
                {!sidebarCollapsed && (
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 500, color: '#F5F5F4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser?.fullName}</p>
                        <p style={{ fontSize: 12, color: '#71717A', textTransform: 'capitalize' }}>{role}</p>
                    </div>
                )}
            </div>
        </aside>
    )
}
