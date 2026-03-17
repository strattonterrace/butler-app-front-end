import { NavLink } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { X } from '@phosphor-icons/react'
import {
    House, Plus, ClockCounterClockwise, Gear, Queue, ListChecks,
    UsersThree, Car, ChartBar, CreditCard,
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

export function MobileDrawer() {
    const { currentUser, switchRole } = useAuthStore()
    const { mobileNavOpen, setMobileNavOpen } = useUIStore()
    const role = currentUser?.role || 'client'
    const items = NAV_ITEMS[role] || NAV_ITEMS.client

    const close = () => setMobileNavOpen(false)

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={close}
                style={{
                    position: 'fixed', inset: 0, zIndex: 40,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    opacity: mobileNavOpen ? 1 : 0,
                    pointerEvents: mobileNavOpen ? 'auto' : 'none',
                    transition: 'opacity 250ms ease',
                }}
            />

            {/* Drawer panel */}
            <aside style={{
                position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
                width: 280, backgroundColor: '#111113',
                borderRight: '1px solid #27272A',
                transform: mobileNavOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex', flexDirection: 'column',
                boxShadow: mobileNavOpen ? '4px 0 20px rgba(0,0,0,0.4)' : 'none',
            }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, padding: '0 20px', borderBottom: '1px solid #27272A' }}>
                    <img src="/images/butlerlogo.png" alt="Butler" style={{ height: 36, objectFit: 'contain' }} />
                    <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717A', padding: 4 }}>
                        <X size={20} weight="bold" />
                    </button>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
                    {items.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={close}
                            end={['/dashboard', '/operator', '/driver', '/admin'].includes(item.to)}
                            style={({ isActive }) => ({
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '12px 16px', borderRadius: 10, fontSize: 15, fontWeight: 500,
                                textDecoration: 'none', transition: 'all 150ms',
                                backgroundColor: isActive ? 'rgba(201,168,76,0.1)' : 'transparent',
                                color: isActive ? '#C9A84C' : '#A1A1AA',
                            })}
                        >
                            <item.icon size={20} weight="regular" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Role Switcher (dev) */}
                <div style={{ borderTop: '1px solid #27272A', padding: 16 }}>
                    <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#71717A', padding: '0 4px', marginBottom: 8 }}>Dev – Switch Role</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                        {['client', 'operator', 'driver', 'admin'].map((r) => (
                            <button key={r} onClick={() => { switchRole(r); close() }}
                                style={{
                                    padding: '8px 8px', borderRadius: 6, fontSize: 13, fontWeight: 500,
                                    textTransform: 'capitalize', border: 'none', cursor: 'pointer',
                                    backgroundColor: role === r ? 'rgba(201,168,76,0.12)' : 'transparent',
                                    color: role === r ? '#C9A84C' : '#71717A',
                                }}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                {/* User info */}
                <div style={{ borderTop: '1px solid #27272A', padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: '50%', backgroundColor: '#1A1A1F',
                        border: '1px solid #27272A', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 600, color: '#A1A1AA', flexShrink: 0,
                    }}>
                        {currentUser?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 500, color: '#F5F5F4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser?.fullName}</p>
                        <p style={{ fontSize: 12, color: '#71717A', textTransform: 'capitalize' }}>{role}</p>
                    </div>
                </div>
            </aside>
        </>
    )
}
