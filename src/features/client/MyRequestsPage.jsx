import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Badge, Button, SkeletonCard } from '@/components/ui'
import { formatDate, SERVICE_TYPES } from '@/lib/utils'
import { MOCK_REQUESTS } from '@/mock/data'
import { PageTransition } from '@/components/motion/Animations'
import { usePageTitle, useDebouncedValue, useIsMobile } from '@/hooks/useEdgeCases'
import { Basket, Pill, TShirt, Package, ArrowUUpLeft, CookingPot, MagnifyingGlass, Funnel, MapPin, CalendarBlank } from '@phosphor-icons/react'

const SERVICE_ICONS = { grocery: Basket, pharmacy: Pill, dry_cleaning: TShirt, package: Package, retail_return: ArrowUUpLeft, food_pickup: CookingPot }
const STATUS_BADGE = { submitted: 'gold', reviewed: 'info', assigned: 'purple', in_progress: 'warning', completed: 'success', closed: 'default', cancelled: 'error' }
const STATUS_LABEL = { submitted: 'Submitted', reviewed: 'Reviewed', assigned: 'Assigned', in_progress: 'In Progress', completed: 'Completed', closed: 'Closed', cancelled: 'Cancelled' }

const FILTER_TABS = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
]

export default function MyRequestsPage() {
    const { currentUser } = useAuthStore()
    const [activeTab, setActiveTab] = useState('all')
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebouncedValue(search)
    const mobile = useIsMobile()
    usePageTitle('My Requests')

    const myRequests = MOCK_REQUESTS.filter(r => r.clientId === currentUser?.id)
    const filtered = myRequests.filter(r => {
        if (activeTab === 'active') return ['submitted', 'reviewed', 'assigned', 'in_progress'].includes(r.status)
        if (activeTab === 'completed') return r.status === 'completed'
        if (activeTab === 'cancelled') return r.status === 'cancelled'
        return true
    }).filter(r => !debouncedSearch || r.title.toLowerCase().includes(debouncedSearch.toLowerCase()))

    const [loading, setLoading] = useState(true)
    useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t) }, [])

    if (loading) return <div style={{ maxWidth: 900, margin: '0 auto' }}><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>

    return (
        <PageTransition>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <div className="page-section">
                    <div style={{ display: 'flex', alignItems: mobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                        <div>
                            <h1 className="heading-1">My Requests</h1>
                            <p className="muted-text" style={{ marginTop: 4 }}>{myRequests.length} total request{myRequests.length !== 1 ? 's' : ''}</p>
                        </div>
                        <Link to="/requests/new"><Button size={mobile ? 'sm' : 'md'}>+ New Request</Button></Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="page-section" style={{ display: 'flex', alignItems: 'center', gap: mobile ? 8 : 12, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', backgroundColor: '#111113', borderRadius: 10, border: '1px solid #27272A', overflow: 'hidden' }}>
                        {FILTER_TABS.map(tab => (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                style={{
                                    padding: mobile ? '6px 10px' : '8px 16px', fontSize: mobile ? 12 : 13, fontWeight: 500, border: 'none', cursor: 'pointer',
                                    backgroundColor: activeTab === tab.key ? 'rgba(201,168,76,0.1)' : 'transparent',
                                    color: activeTab === tab.key ? '#C9A84C' : '#71717A', transition: 'all 150ms',
                                }}
                            >{tab.label}</button>
                        ))}
                    </div>
                    <div style={{ flex: 1, position: 'relative', minWidth: 200 }}>
                        <MagnifyingGlass size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#71717A' }} />
                        <input
                            placeholder="Search requests..."
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%', height: 38, borderRadius: 10, border: '1px solid #27272A',
                                backgroundColor: '#1E1E24', padding: '0 12px 0 36px', fontSize: 13,
                                color: '#F5F5F4', outline: 'none', fontFamily: 'inherit',
                            }}
                        />
                    </div>
                </div>

                {/* Request List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {filtered.length > 0 ? filtered.map(req => {
                        const ServiceIcon = SERVICE_ICONS[req.serviceType] || Basket
                        return (
                            <Link key={req.id} to={`/requests/${req.id}`} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: mobile ? 10 : 16, padding: mobile ? '12px 14px' : '16px 20px',
                                    backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: mobile ? 12 : 14,
                                    cursor: 'pointer', transition: 'all 150ms', overflow: 'hidden',
                                }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#27272A'; e.currentTarget.style.transform = 'none' }}
                                >
                                    <div style={{ width: mobile ? 36 : 42, height: mobile ? 36 : 42, borderRadius: mobile ? 8 : 10, backgroundColor: '#1A1A1F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A1A1AA', flexShrink: 0 }}>
                                        <ServiceIcon size={mobile ? 18 : 20} weight="regular" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                                            <p style={{ fontSize: mobile ? 13 : 14, fontWeight: 600, color: '#F5F5F4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: mobile ? '160px' : 'none' }}>{req.title}</p>
                                            <Badge variant={STATUS_BADGE[req.status]} size="sm">{STATUS_LABEL[req.status]}</Badge>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 8 : 16, fontSize: mobile ? 11 : 12, color: '#71717A', flexWrap: 'wrap' }}>
                                            <span>{SERVICE_TYPES[req.serviceType]?.label}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} />{req.dropoffLocation.split(',')[0]}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CalendarBlank size={12} />{formatDate(req.createdAt, { format: 'relative' })}</span>
                                        </div>
                                    </div>
                                    {!mobile && req.driverName && (
                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                            <p style={{ fontSize: 12, color: '#A1A1AA' }}>{req.driverName}</p>
                                            <p style={{ fontSize: 11, color: '#71717A', textTransform: 'capitalize' }}>{req.urgency}</p>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        )
                    }) : (
                        <div style={{ textAlign: 'center', padding: '48px 0' }}>
                            <Funnel size={32} style={{ color: '#71717A', margin: '0 auto 12px' }} />
                            <p style={{ fontSize: 14, color: '#71717A' }}>No requests match your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    )
}
