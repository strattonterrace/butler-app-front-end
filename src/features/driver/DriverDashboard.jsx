import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Badge, Button, Card, SkeletonCard } from '@/components/ui'
import { toast } from 'sonner'
import { formatDate, formatCurrency, SERVICE_TYPES } from '@/lib/utils'
import { MOCK_REQUESTS, MOCK_DRIVER_STATS, MOCK_AVAILABLE_ORDERS } from '@/mock/data'
import { PageTransition } from '@/components/motion/Animations'
import { usePageTitle, useIsMobile } from '@/hooks/useEdgeCases'
import { CheckCircle, ListChecks, MapPin, Play, Star, CurrencyDollar, Percent, ShoppingCart, Check, X } from '@phosphor-icons/react'

const STATUS_BADGE = { assigned: 'purple', in_progress: 'warning' }
const STATUS_LABEL = { assigned: 'Assigned', in_progress: 'In Progress' }

function StatsCard({ label, value, icon: Icon, accent }) {
    return (
        <div style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2vw, 16px) clamp(14px, 2.5vw, 20px)' }}>
            <Icon size={16} style={{ color: accent, marginBottom: 'clamp(4px, 1vw, 6px)' }} />
            <p style={{ fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 700, color: '#F5F5F4', lineHeight: 1.1 }}>{value}</p>
            <p style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', color: '#71717A', marginTop: 'clamp(2px, 0.5vw, 4px)' }}>{label}</p>
        </div>
    )
}

function TaskCard({ request, type }) {
    return (
        <Card>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#F5F5F4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{request.title}</p>
                    <p style={{ fontSize: 12, color: '#71717A' }}>{SERVICE_TYPES[request.serviceType]?.label} · {request.clientName}</p>
                </div>
                <Badge variant={STATUS_BADGE[request.status]} size="sm">{STATUS_LABEL[request.status]}</Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#71717A', marginTop: 8, flexWrap: 'wrap' }}>
                <MapPin size={13} />{request.pickupLocation.split(',')[0]}
                <span style={{ margin: '0 4px' }}>→</span>{request.dropoffLocation.split(',')[0]}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid #1F1F23' }}>
                <span style={{ fontSize: 12, color: '#71717A', textTransform: 'capitalize' }}>{request.urgency}</span>
                {type === 'assigned'
                    ? <Button size="sm" onClick={() => toast.success('Task started', { description: request.title })}><Play size={14} weight="fill" /> Start Task</Button>
                    : <Button size="sm" variant="secondary" onClick={() => toast.success('Task completed!', { description: request.title })}><CheckCircle size={14} weight="bold" /> Mark Completed</Button>
                }
            </div>
        </Card>
    )
}

export default function DriverDashboard() {
    const { currentUser } = useAuthStore()
    usePageTitle('Driver Dashboard')
    const mobile = useIsMobile()
    const [loading, setLoading] = useState(true)
    useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t) }, [])

    if (loading) return (
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div className="page-section" style={{ height: 40, width: '50%', backgroundColor: '#1A1A1F', borderRadius: 8, animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
            <div className="page-section grid-stats">{[1, 2, 3, 4].map(i => <SkeletonCard key={i} lines={1} />)}</div>
            <div className="page-section grid-cards">{[1, 2].map(i => <SkeletonCard key={i} lines={3} />)}</div>
        </div>
    )

    const firstName = currentUser?.fullName?.split(' ')[0] || 'Driver'
    const myTasks = MOCK_REQUESTS.filter(r => r.driverId === currentUser?.id)
    const assigned = myTasks.filter(r => r.status === 'assigned')
    const inProgress = myTasks.filter(r => r.status === 'in_progress')
    const completed = myTasks.filter(r => r.status === 'completed')

    // Driver stats — mock: Marcus Johnson
    const stats = MOCK_DRIVER_STATS[currentUser?.id] || MOCK_DRIVER_STATS['usr_010']

    return (
        <PageTransition>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <div className="page-section">
                    <h1 className="heading-1">Hey {firstName}</h1>
                    <p className="muted-text" style={{ marginTop: 4 }}>
                        {assigned.length + inProgress.length > 0
                            ? `You have ${assigned.length + inProgress.length} active task${assigned.length + inProgress.length > 1 ? 's' : ''}.`
                            : 'No tasks right now — enjoy the break.'}
                    </p>
                </div>

                {/* ── 7 Stats ── */}
                <div className="page-section grid-stats">
                    <StatsCard label="Assigned" value={assigned.length} icon={ShoppingCart} accent="#8B5CF6" />
                    <StatsCard label="In Progress" value={inProgress.length} icon={Play} accent="#F97316" />
                    <StatsCard label="Done Today" value={completed.length} icon={CheckCircle} accent="#22C55E" />
                    <StatsCard label="Earnings Today" value={formatCurrency(stats.earningsToday)} icon={CurrencyDollar} accent="#C9A84C" />
                    <StatsCard label="Earnings This Week" value={formatCurrency(stats.earningsWeek)} icon={CurrencyDollar} accent="#22C55E" />
                    <StatsCard label="Your Rating" value={stats.rating ? `${stats.rating} ★` : '—'} icon={Star} accent="#F59E0B" />
                    <StatsCard label="Acceptance Rate" value={stats.acceptanceRate ? `${(stats.acceptanceRate * 100).toFixed(0)}%` : '—'} icon={Percent} accent="#3B82F6" />
                </div>

                {/* ── Available Orders ── */}
                {MOCK_AVAILABLE_ORDERS.length > 0 && (
                    <div className="page-section">
                        <div className="section-header">
                            <h2 className="heading-2">Available Orders <span style={{ fontSize: 14, fontWeight: 400, color: '#71717A' }}>({MOCK_AVAILABLE_ORDERS.length})</span></h2>
                        </div>
                        <div className="grid-cards">
                            {MOCK_AVAILABLE_ORDERS.map(order => (
                                <Card key={order.id}>
                                    <div style={{ marginBottom: 8 }}>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: '#F5F5F4' }}>{order.title}</p>
                                        <p style={{ fontSize: 12, color: '#71717A' }}>{SERVICE_TYPES[order.serviceType]?.label} · {order.clientName}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#71717A', flexWrap: 'wrap' }}>
                                        <MapPin size={13} />{order.pickupLocation} <span>→</span> {order.dropoffLocation.split(',')[0]}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 12, color: '#71717A' }}>
                                        <span style={{ color: '#C9A84C', fontWeight: 500, textTransform: 'capitalize' }}>{order.urgency}</span>
                                        {order.estimatedBudget && <span>· Est. {order.estimatedBudget}</span>}
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid #1F1F23' }}>
                                        <Button size="sm" onClick={() => toast.success('Order accepted!', { description: order.title })} style={{ flex: 1 }}>
                                            <Check size={14} weight="bold" /> Accept
                                        </Button>
                                        <button onClick={() => toast.info('Order declined')}
                                            style={{ flex: 1, height: 32, borderRadius: 8, border: '1px solid #27272A', backgroundColor: '#1A1A1F', color: '#A1A1AA', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                            <X size={14} /> Decline
                                        </button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Assigned Tasks ── */}
                {assigned.length > 0 && (
                    <div className="page-section">
                        <div className="section-header"><h2 className="heading-2">Assigned to You</h2></div>
                        <div className="grid-cards">
                            {assigned.map(req => <TaskCard key={req.id} request={req} type="assigned" />)}
                        </div>
                    </div>
                )}

                {/* ── In Progress ── */}
                {inProgress.length > 0 && (
                    <div className="page-section">
                        <div className="section-header"><h2 className="heading-2">In Progress</h2></div>
                        <div className="grid-cards">
                            {inProgress.map(req => <TaskCard key={req.id} request={req} type="in_progress" />)}
                        </div>
                    </div>
                )}

                {assigned.length === 0 && inProgress.length === 0 && MOCK_AVAILABLE_ORDERS.length === 0 && (
                    <Card>
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <ListChecks size={40} style={{ color: '#71717A', margin: '0 auto 12px' }} />
                            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#F5F5F4', marginBottom: 4 }}>All clear</h3>
                            <p style={{ fontSize: 14, color: '#71717A' }}>No tasks assigned to you at the moment.</p>
                        </div>
                    </Card>
                )}
            </div>
        </PageTransition>
    )
}
