import { useState, useEffect } from 'react'
import { Badge, SkeletonTable } from '@/components/ui'
import { formatDate, SERVICE_TYPES } from '@/lib/utils'
import { MOCK_REQUESTS } from '@/mock/data'
import { PageTransition } from '@/components/motion/Animations'
import { MagnifyingGlass } from '@phosphor-icons/react'

const STATUS_BADGE = { submitted: 'gold', reviewed: 'info', assigned: 'purple', in_progress: 'warning', completed: 'success', cancelled: 'error' }
const STATUS_LABEL = { submitted: 'Submitted', reviewed: 'Reviewed', assigned: 'Assigned', in_progress: 'In Progress', completed: 'Completed', cancelled: 'Cancelled' }
const TABS = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
]

export default function AdminRequestsPage() {
    const [activeTab, setActiveTab] = useState('all')
    const [search, setSearch] = useState('')

    const filtered = MOCK_REQUESTS
        .filter(r => {
            if (activeTab === 'active') return ['submitted', 'reviewed', 'assigned', 'in_progress'].includes(r.status)
            if (activeTab === 'completed') return r.status === 'completed'
            if (activeTab === 'cancelled') return r.status === 'cancelled'
            return true
        })
        .filter(r => !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.clientName.toLowerCase().includes(search.toLowerCase()))

    const [loading, setLoading] = useState(true)
    useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t) }, [])

    if (loading) return <div style={{ maxWidth: 1100, margin: '0 auto' }}><SkeletonTable /></div>

    return (
        <PageTransition>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <div className="page-section">
                    <h1 className="heading-1">All Requests</h1>
                    <p className="muted-text" style={{ marginTop: 4 }}>{MOCK_REQUESTS.length} total requests</p>
                </div>

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
                        <input placeholder="Search requests..." value={search} onChange={(e) => setSearch(e.target.value)}
                            style={{ width: '100%', height: 38, borderRadius: 10, border: '1px solid #27272A', backgroundColor: '#1E1E24', padding: '0 12px 0 36px', fontSize: 13, color: '#F5F5F4', outline: 'none', fontFamily: 'inherit' }} />
                    </div>
                </div>

                <div style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 14, overflow: 'hidden' }}>
                    <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #27272A' }}>
                                {['Request', 'Service', 'Client', 'Driver', 'Urgency', 'Status', 'Created'].map(h => (
                                    <th key={h} style={{ textAlign: 'left', fontSize: 11, color: '#71717A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 16px' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(req => (
                                <tr key={req.id} style={{ borderBottom: '1px solid #1F1F23', cursor: 'pointer' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(26,26,31,0.5)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <td style={{ padding: '14px 16px', fontWeight: 500, color: '#F5F5F4', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.title}</td>
                                    <td style={{ padding: '14px 16px', color: '#A1A1AA', fontSize: 13 }}>{SERVICE_TYPES[req.serviceType]?.label}</td>
                                    <td style={{ padding: '14px 16px', color: '#A1A1AA' }}>{req.clientName}</td>
                                    <td style={{ padding: '14px 16px', color: '#A1A1AA' }}>{req.driverName || '—'}</td>
                                    <td style={{ padding: '14px 16px', color: '#C9A84C', fontSize: 13, textTransform: 'capitalize' }}>{req.urgency}</td>
                                    <td style={{ padding: '14px 16px' }}><Badge variant={STATUS_BADGE[req.status]} size="sm">{STATUS_LABEL[req.status]}</Badge></td>
                                    <td style={{ padding: '14px 16px', color: '#71717A', fontSize: 13 }}>{formatDate(req.createdAt, { format: 'relative' })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && <p style={{ textAlign: 'center', fontSize: 14, color: '#71717A', padding: '32px 0' }}>No requests match your filters.</p>}
                </div>
            </div>
        </PageTransition>
    )
}
