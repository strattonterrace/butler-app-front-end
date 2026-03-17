import { useState, useEffect } from 'react'
import { Badge, Card, SkeletonCard } from '@/components/ui'
import { toast } from 'sonner'
import { formatDate, formatCurrency, SERVICE_TYPES } from '@/lib/utils'
import { MOCK_REQUESTS, MOCK_TERRITORIES } from '@/mock/data'
import { Link } from 'react-router-dom'
import { PageTransition } from '@/components/motion/Animations'
import { usePageTitle, useIsMobile } from '@/hooks/useEdgeCases'
import { ClockCountdown, UserCirclePlus, CheckCircle, Lightning, MapPin, ArrowRight, Users, Car, CurrencyDollar, Timer, Percent, ShoppingCart } from '@phosphor-icons/react'

const STATUS_BADGE = { submitted: 'gold', reviewed: 'info', assigned: 'purple', in_progress: 'warning', completed: 'success' }
const STATUS_LABEL = { submitted: 'Submitted', reviewed: 'Reviewed', assigned: 'Assigned', in_progress: 'In Progress', completed: 'Completed' }

function StatsCard({ label, value, icon: Icon, accent }) {
    return (
        <div style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2vw, 16px) clamp(14px, 2.5vw, 20px)' }}>
            <Icon size={16} style={{ color: accent, marginBottom: 'clamp(4px, 1vw, 8px)' }} />
            <p style={{ fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 700, color: '#F5F5F4', lineHeight: 1.1 }}>{value}</p>
            <p style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', color: '#71717A', marginTop: 'clamp(2px, 0.5vw, 4px)' }}>{label}</p>
        </div>
    )
}

function QueueCard({ request }) {
    return (
        <Card>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#F5F5F4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{request.title}</p>
                    <p style={{ fontSize: 12, color: '#71717A' }}>{SERVICE_TYPES[request.serviceType]?.label} · {request.clientName}</p>
                </div>
                <Badge variant={STATUS_BADGE[request.status]} size="sm">{STATUS_LABEL[request.status]}</Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#71717A', marginTop: 8 }}>
                <MapPin size={13} />{request.pickupLocation.split(',')[0]}
                <span>→</span>{request.dropoffLocation.split(',')[0]}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid #1F1F23' }}>
                <span style={{ fontSize: 12, color: '#71717A' }}>{formatDate(request.createdAt, { format: 'relative' })}</span>
                <span style={{ fontSize: 12, color: '#C9A84C', fontWeight: 500, textTransform: 'capitalize' }}>{request.urgency}</span>
            </div>
        </Card>
    )
}

export default function OperatorDashboard() {
    usePageTitle('Operator Dashboard')
    const mobile = useIsMobile()
    const [loading, setLoading] = useState(true)
    useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t) }, [])

    if (loading) return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div className="page-section" style={{ height: 40, width: '50%', backgroundColor: '#1A1A1F', borderRadius: 8, animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
            <div className="page-section grid-stats">{[1, 2, 3, 4].map(i => <SkeletonCard key={i} lines={1} />)}</div>
            <div className="page-section grid-cards">{[1, 2].map(i => <SkeletonCard key={i} lines={3} />)}</div>
        </div>
    )

    // Operator sees only their territory — mock: Alex Rivera → Orange County
    const territory = MOCK_TERRITORIES[0]
    const submitted = MOCK_REQUESTS.filter(r => r.status === 'submitted')
    const assigned = MOCK_REQUESTS.filter(r => r.status === 'assigned')
    const inProgress = MOCK_REQUESTS.filter(r => r.status === 'in_progress')
    const completedToday = MOCK_REQUESTS.filter(r => r.status === 'completed')
    const ordersThisMonth = [...submitted, ...assigned, ...inProgress, ...completedToday]

    return (
        <PageTransition>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <div className="page-section">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{territory.name}</span>
                    </div>
                    <h1 className="heading-1">Operator Dashboard</h1>
                    <p className="muted-text" style={{ marginTop: 4 }}>Territory overview and request management.</p>
                </div>

                {/* ── 8 Territory Metrics ── */}
                <div className="page-section grid-stats">
                    <StatsCard label="Active Clients" value={territory.clients} icon={Users} accent="#3B82F6" />
                    <StatsCard label="Active Drivers" value={territory.drivers} icon={Car} accent="#22C55E" />
                    <StatsCard label="Orders Today" value={submitted.length + assigned.length + inProgress.length + completedToday.length} icon={ShoppingCart} accent="#F59E0B" />
                    <StatsCard label="Orders This Month" value={territory.ordersThisMonth} icon={ShoppingCart} accent="#A1A1AA" />
                    <StatsCard label="Territory Revenue" value={formatCurrency(territory.revenue)} icon={CurrencyDollar} accent="#C9A84C" />
                    <StatsCard label="Your Commission" value={formatCurrency(territory.commission)} icon={CurrencyDollar} accent="#22C55E" />
                    <StatsCard label="Completion Rate" value={`${(territory.completionRate * 100).toFixed(0)}%`} icon={Percent} accent="#8B5CF6" />
                    <StatsCard label="Avg Fulfillment" value={`${territory.avgFulfillmentTime}m`} icon={Timer} accent="#3B82F6" />
                </div>

                {/* ── Incoming Requests ── */}
                <div className="page-section">
                    <div className="section-header">
                        <h2 className="heading-2">
                            Incoming Requests
                            {submitted.length > 0 && <span style={{ marginLeft: 8, fontSize: 14, fontWeight: 400, color: '#71717A' }}>({submitted.length})</span>}
                        </h2>
                        <Link to="/operator/queue" style={{ fontSize: 13, color: '#C9A84C', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                            View queue <ArrowRight size={13} />
                        </Link>
                    </div>
                    {submitted.length > 0 ? (
                        <div className="grid-cards">
                            {submitted.map(req => <QueueCard key={req.id} request={req} />)}
                        </div>
                    ) : (
                        <Card><p style={{ textAlign: 'center', fontSize: 14, color: '#71717A', padding: '24px 0' }}>All caught up — no pending requests.</p></Card>
                    )}
                </div>

                {/* ── Active Fulfillments Table ── */}
                <div className="page-section">
                    <div className="section-header">
                        <h2 className="heading-2">Active Fulfillments</h2>
                        <Link to="/operator/active" style={{ fontSize: 13, color: '#C9A84C', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                            View all <ArrowRight size={13} />
                        </Link>
                    </div>
                    <div className="responsive-table" style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 14, overflow: 'hidden' }}>
                        <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #27272A' }}>
                                    {['Request', 'Client', 'Driver', 'Status', 'Updated'].map(h => (
                                        <th key={h} style={{ textAlign: 'left', fontSize: 11, color: '#71717A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 16px' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[...assigned, ...inProgress].map(req => (
                                    <tr key={req.id} style={{ borderBottom: '1px solid #1F1F23' }}>
                                        <td style={{ padding: '12px 16px', fontWeight: 500, color: '#F5F5F4' }}>{req.title}</td>
                                        <td style={{ padding: '12px 16px', color: '#A1A1AA' }}>{req.clientName}</td>
                                        <td style={{ padding: '12px 16px', color: '#A1A1AA' }}>{req.driverName || '—'}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <Badge variant={STATUS_BADGE[req.status]} size="sm">{STATUS_LABEL[req.status]}</Badge>
                                        </td>
                                        <td style={{ padding: '12px 16px', color: '#71717A' }}>{formatDate(req.updatedAt, { format: 'relative' })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {assigned.length === 0 && inProgress.length === 0 && (
                            <p style={{ textAlign: 'center', fontSize: 14, color: '#71717A', padding: '32px 0' }}>No active fulfillments.</p>
                        )}
                    </div>
                </div>

                {/* ── Quick Links ── */}
                <div className="page-section grid-stats">
                    {[
                        { to: '/operator/queue', label: 'Request Queue', icon: ClockCountdown },
                        { to: '/operator/active', label: 'Active Orders', icon: Lightning },
                        { to: '/operator/clients', label: 'Client Mgmt', icon: Users },
                        { to: '/operator/drivers', label: 'Driver Mgmt', icon: Car },
                    ].map(link => (
                        <Link key={link.to} to={link.to} style={{ textDecoration: 'none' }}>
                            <Card interactive style={{ textAlign: 'center', padding: mobile ? '16px 12px' : '24px 16px' }}>
                                <link.icon size={mobile ? 20 : 24} style={{ color: '#71717A', margin: '0 auto 8px' }} />
                                <p style={{ fontSize: mobile ? 12 : 14, fontWeight: 500, color: '#F5F5F4' }}>{link.label}</p>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </PageTransition>
    )
}
