import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { useEscapeKey, useIsMobile } from '@/hooks/useEdgeCases'
import { Bell, List, Gear, SignOut, UserCircle } from '@phosphor-icons/react'

const ROLE_COLORS = { client: '#3B82F6', operator: '#F59E0B', driver: '#22C55E', admin: '#8B5CF6' }
const ROLE_BGS = { client: 'rgba(59,130,246,0.1)', operator: 'rgba(245,158,11,0.1)', driver: 'rgba(34,197,94,0.1)', admin: 'rgba(139,92,246,0.1)' }

const SETTINGS_ROUTES = { client: '/settings', driver: '/driver/settings', admin: '/admin/settings' }

export function TopBar() {
    const { currentUser, logout } = useAuthStore()
    const { setMobileNavOpen } = useUIStore()
    const navigate = useNavigate()
    const role = currentUser?.role || 'client'
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const mobile = useIsMobile()
    useEscapeKey(useCallback(() => setDropdownOpen(false), []))

    const handleLogout = async () => {
        setDropdownOpen(false)
        await logout()
        toast('Signed out', { description: 'See you next time.' })
        navigate('/login')
    }

    const handleSettings = () => {
        setDropdownOpen(false)
        navigate(SETTINGS_ROUTES[role] || '/settings')
    }

    return (
        <header className="app-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                    onClick={() => setMobileNavOpen(true)}
                    className="md:hidden"
                    style={{ padding: 8, borderRadius: 8, border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: '#A1A1AA' }}
                >
                    <List size={22} weight="bold" />
                </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 8 : 16 }}>
                {/* Role Badge */}
                <span style={{
                    padding: mobile ? '3px 8px' : '4px 12px', borderRadius: 999, fontSize: mobile ? 10 : 11, fontWeight: 600,
                    textTransform: 'capitalize', backgroundColor: ROLE_BGS[role],
                    color: ROLE_COLORS[role], border: `1px solid ${ROLE_COLORS[role]}33`,
                }}>
                    {role}
                </span>

                {/* Notification */}
                <button style={{
                    position: 'relative', padding: mobile ? 6 : 8, borderRadius: 8, border: 'none',
                    cursor: 'pointer', backgroundColor: 'transparent', color: '#A1A1AA',
                }}>
                    <Bell size={mobile ? 18 : 20} weight="regular" />
                    <span style={{
                        position: 'absolute', top: mobile ? 4 : 6, right: mobile ? 4 : 6, width: 7, height: 7,
                        borderRadius: '50%', backgroundColor: '#C9A84C',
                    }} />
                </button>

                {/* User + Dropdown */}
                <div style={{ position: 'relative', paddingLeft: mobile ? 8 : 16, borderLeft: '1px solid #27272A' }}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 10, background: 'none',
                            border: 'none', cursor: 'pointer', padding: 0,
                        }}
                    >
                        <div style={{
                            width: mobile ? 30 : 34, height: mobile ? 30 : 34, borderRadius: '50%', backgroundColor: '#1A1A1F',
                            border: '1px solid #27272A', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: mobile ? 11 : 12, fontWeight: 600, color: '#A1A1AA',
                        }}>
                            {currentUser?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                        </div>
                        {!mobile && (
                            <div style={{ textAlign: 'left' }}>
                                <p style={{ fontSize: 14, fontWeight: 500, color: '#F5F5F4', lineHeight: 1.2 }}>{currentUser?.fullName}</p>
                                <p style={{ fontSize: 12, color: '#71717A' }}>{currentUser?.email}</p>
                            </div>
                        )}
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <>
                            <div onClick={() => setDropdownOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />
                            <div style={{
                                position: 'absolute', top: '100%', right: 0, marginTop: 8,
                                width: 220, backgroundColor: '#111113', border: '1px solid #27272A',
                                borderRadius: 12, padding: 4, zIndex: 40,
                                boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                            }}>
                                {/* Role badge inside dropdown */}
                                <div style={{ padding: '10px 12px', borderBottom: '1px solid #1F1F23', marginBottom: 4 }}>
                                    <p style={{ fontSize: 13, fontWeight: 500, color: '#F5F5F4' }}>{currentUser?.fullName}</p>
                                    <span style={{
                                        display: 'inline-block', marginTop: 4, padding: '2px 8px', borderRadius: 999,
                                        fontSize: 10, fontWeight: 600, textTransform: 'capitalize',
                                        backgroundColor: ROLE_BGS[role], color: ROLE_COLORS[role],
                                    }}>{role}</span>
                                </div>

                                {/* Settings */}
                                {SETTINGS_ROUTES[role] && (
                                    <button onClick={handleSettings}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                                            padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                                            backgroundColor: 'transparent', color: '#A1A1AA', fontSize: 14,
                                            textAlign: 'left', transition: 'background-color 150ms',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1A1A1F'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <Gear size={16} /> Account Settings
                                    </button>
                                )}

                                {/* Logout */}
                                <button onClick={handleLogout}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                                        padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                                        backgroundColor: 'transparent', color: '#EF4444', fontSize: 14,
                                        textAlign: 'left', transition: 'background-color 150ms',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.06)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <SignOut size={16} /> Sign Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
