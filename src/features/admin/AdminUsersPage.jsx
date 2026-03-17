import { useState, useEffect } from 'react'
import { Badge, Button, SkeletonTable } from '@/components/ui'
import { toast } from 'sonner'
import { MOCK_ALL_USERS } from '@/mock/data'
import { PageTransition } from '@/components/motion/Animations'
import { usePageTitle, useDebouncedValue } from '@/hooks/useEdgeCases'
import { MagnifyingGlass, DotsThree, X, ShieldCheck, UserMinus, UserPlus, Trash } from '@phosphor-icons/react'

const ROLE_BADGE = { client: 'info', operator: 'warning', driver: 'success', admin: 'purple' }
const TABS = [
    { key: 'all', label: 'All' },
    { key: 'client', label: 'Clients' },
    { key: 'operator', label: 'Operators' },
    { key: 'driver', label: 'Drivers' },
    { key: 'admin', label: 'Admins' },
]

function UserDetailModal({ user, onClose }) {
    if (!user) return null
    return (
        <>
            <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 40 }} />
            <div style={{
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 50,
                width: '100%', maxWidth: 480, backgroundColor: '#111113', border: '1px solid #27272A',
                borderRadius: 16, padding: 0, boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #27272A' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#F5F5F4' }}>User Details</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717A', padding: 4 }}><X size={18} /></button>
                </div>

                {/* Profile */}
                <div style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                        <div style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: '#1A1A1F', border: '2px solid #27272A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 600, color: '#A1A1AA' }}>
                            {user.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <p style={{ fontSize: 16, fontWeight: 600, color: '#F5F5F4' }}>{user.fullName}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                <Badge variant={ROLE_BADGE[user.role]} size="sm" style={{ textTransform: 'capitalize' }}>{user.role}</Badge>
                                <span style={{ fontSize: 12, fontWeight: 500, color: user.status === 'active' ? '#22C55E' : '#71717A', textTransform: 'capitalize' }}>● {user.status}</span>
                            </div>
                        </div>
                    </div>

                    {/* Info rows */}
                    {[
                        { label: 'Email', value: user.email },
                        { label: 'Phone', value: user.phone },
                        { label: 'Joined', value: user.createdAt },
                        ...(user.subscription ? [{ label: 'Subscription', value: `${user.subscription.plan} · ${user.subscription.status}` }] : []),
                        ...(user.vehicle ? [{ label: 'Vehicle', value: `${user.vehicle.year} ${user.vehicle.make} ${user.vehicle.model} · ${user.vehicle.plate}` }] : []),
                    ].map((row, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1F1F23' }}>
                            <span style={{ fontSize: 13, color: '#71717A' }}>{row.label}</span>
                            <span style={{ fontSize: 13, color: '#F5F5F4', fontWeight: 500 }}>{row.value}</span>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div style={{ padding: '12px 20px 20px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {user.status === 'active' ? (
                        <Button variant="secondary" size="sm" onClick={() => toast.warning('User suspended', { description: user.fullName })} style={{ color: '#F59E0B', borderColor: 'rgba(245,158,11,0.3)' }}>
                            <UserMinus size={14} /> Suspend
                        </Button>
                    ) : (
                        <Button variant="secondary" size="sm" onClick={() => toast.success('User reactivated', { description: user.fullName })} style={{ color: '#22C55E', borderColor: 'rgba(34,197,94,0.3)' }}>
                            <ShieldCheck size={14} /> Reactivate
                        </Button>
                    )}
                    <Button variant="secondary" size="sm" onClick={() => toast.info('Role changed', { description: user.fullName })}><UserPlus size={14} /> Change Role</Button>
                    <Button variant="destructive" size="sm" onClick={() => toast.error('User deleted', { description: user.fullName })}><Trash size={14} /> Delete</Button>
                </div>
            </div>
        </>
    )
}

export default function AdminUsersPage() {
    const [activeTab, setActiveTab] = useState('all')
    const [search, setSearch] = useState('')
    const [selectedUser, setSelectedUser] = useState(null)
    const [showCreateForm, setShowCreateForm] = useState(false)

    const filtered = MOCK_ALL_USERS
        .filter(u => activeTab === 'all' || u.role === activeTab)
        .filter(u => !search || u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="page-section">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h1 className="heading-1">User Management</h1>
                        <p className="muted-text" style={{ marginTop: 4 }}>{MOCK_ALL_USERS.length} total users</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Button variant="secondary" onClick={() => setShowCreateForm(!showCreateForm)}>+ Create Operator</Button>
                        <Button>+ Add User</Button>
                    </div>
                </div>
            </div>

            {/* Create Operator Mini-form */}
            {showCreateForm && (
                <div className="page-section" style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 14, padding: 20, display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 160 }}>
                        <label style={{ fontSize: 12, color: '#71717A', display: 'block', marginBottom: 4 }}>Full Name</label>
                        <input placeholder="New Operator" style={{ width: '100%', height: 36, borderRadius: 8, border: '1px solid #27272A', backgroundColor: '#1E1E24', color: '#F5F5F4', padding: '0 12px', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <label style={{ fontSize: 12, color: '#71717A', display: 'block', marginBottom: 4 }}>Email</label>
                        <input placeholder="operator@butler.com" style={{ width: '100%', height: 36, borderRadius: 8, border: '1px solid #27272A', backgroundColor: '#1E1E24', color: '#F5F5F4', padding: '0 12px', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
                    </div>
                    <Button size="sm" onClick={() => { toast.success('Operator created'); setShowCreateForm(false) }}>Create</Button>
                    <button onClick={() => setShowCreateForm(false)} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 12, border: '1px solid #27272A', backgroundColor: 'transparent', color: '#71717A', cursor: 'pointer' }}>Cancel</button>
                </div>
            )}

            <div className="page-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', backgroundColor: '#111113', borderRadius: 10, border: '1px solid #27272A', overflow: 'hidden' }}>
                    {TABS.map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                            style={{ padding: '8px 14px', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', backgroundColor: activeTab === tab.key ? 'rgba(201,168,76,0.1)' : 'transparent', color: activeTab === tab.key ? '#C9A84C' : '#71717A', transition: 'all 150ms' }}
                        >{tab.label}</button>
                    ))}
                </div>
                <div style={{ position: 'relative', width: 240 }}>
                    <MagnifyingGlass size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#71717A' }} />
                    <input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
                        style={{ width: '100%', height: 38, borderRadius: 10, border: '1px solid #27272A', backgroundColor: '#1E1E24', padding: '0 12px 0 36px', fontSize: 13, color: '#F5F5F4', outline: 'none', fontFamily: 'inherit' }} />
                </div>
            </div>

            <div style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 14, overflow: 'hidden' }}>
                <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #27272A' }}>
                            {['User', 'Role', 'Status', 'Phone', 'Joined', ''].map(h => (
                                <th key={h} style={{ textAlign: 'left', fontSize: 11, color: '#71717A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 16px' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #1F1F23', cursor: 'pointer' }}
                                onClick={() => setSelectedUser(user)}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(26,26,31,0.5)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <td style={{ padding: '14px 16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#1A1A1F', border: '1px solid #27272A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#A1A1AA' }}>
                                            {user.fullName.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 500, color: '#F5F5F4' }}>{user.fullName}</p>
                                            <p style={{ fontSize: 12, color: '#71717A' }}>{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '14px 16px' }}><Badge variant={ROLE_BADGE[user.role]} size="sm" style={{ textTransform: 'capitalize' }}>{user.role}</Badge></td>
                                <td style={{ padding: '14px 16px' }}>
                                    <span style={{ fontSize: 12, fontWeight: 500, color: user.status === 'active' ? '#22C55E' : '#71717A', textTransform: 'capitalize' }}>{user.status}</span>
                                </td>
                                <td style={{ padding: '14px 16px', color: '#A1A1AA', fontSize: 13 }}>{user.phone}</td>
                                <td style={{ padding: '14px 16px', color: '#71717A', fontSize: 13 }}>{user.createdAt}</td>
                                <td style={{ padding: '14px 16px' }}>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717A', padding: 4 }}><DotsThree size={20} weight="bold" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && <p style={{ textAlign: 'center', fontSize: 14, color: '#71717A', padding: '32px 0' }}>No users found.</p>}
            </div>

            {/* User Detail Modal */}
            <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
        </div>
    )
}
