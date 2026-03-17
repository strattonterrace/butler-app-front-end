import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Badge, Button, Card, SkeletonCard } from '@/components/ui'
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from '@/components/motion/Animations'
import { getGreeting, formatDate, SERVICE_TYPES } from '@/lib/utils'
import { MOCK_REQUESTS } from '@/mock/data'
import { useIsMobile } from '@/hooks/useEdgeCases'
import { Plus, ArrowRight, CalendarBlank, MapPin, Basket, Pill, TShirt, Package, ArrowUUpLeft, CookingPot } from '@phosphor-icons/react'

const SERVICE_ICONS = { grocery: Basket, pharmacy: Pill, dry_cleaning: TShirt, package: Package, retail_return: ArrowUUpLeft, food_pickup: CookingPot }
const STATUS_BADGE = { submitted: 'gold', reviewed: 'info', assigned: 'purple', in_progress: 'warning', completed: 'success', closed: 'default', cancelled: 'error' }
const STATUS_LABEL = { submitted: 'Submitted', reviewed: 'Reviewed', assigned: 'Assigned', in_progress: 'In Progress', completed: 'Completed', closed: 'Closed', cancelled: 'Cancelled' }

function StatsCard({ label, value, subtext, mobile }) {
    return (
        <div style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: mobile ? 12 : 14, padding: mobile ? '12px 14px' : '16px 20px' }}>
            <p style={{ fontSize: mobile ? 11 : 13, color: '#71717A', marginBottom: mobile ? 2 : 4 }}>{label}</p>
            <p style={{ fontSize: mobile ? 20 : 28, fontWeight: 700, color: '#F5F5F4', lineHeight: 1.1 }}>{value}</p>
            {subtext && <p style={{ fontSize: mobile ? 10 : 12, color: '#71717A', marginTop: mobile ? 2 : 4 }}>{subtext}</p>}
        </div>
    )
}

function RequestCard({ request }) {
    const ServiceIcon = SERVICE_ICONS[request.serviceType] || Basket
    return (
        <Link to={`/requests/${request.id}`} style={{ textDecoration: 'none' }}>
            <Card interactive>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 10, backgroundColor: '#1A1A1F',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A1A1AA',
                        }}>
                            <ServiceIcon size={20} weight="regular" />
                        </div>
                        <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: '#F5F5F4' }}>{request.title}</p>
                            <p style={{ fontSize: 12, color: '#71717A' }}>{SERVICE_TYPES[request.serviceType]?.label}</p>
                        </div>
                    </div>
                    <Badge variant={STATUS_BADGE[request.status]} size="sm">{STATUS_LABEL[request.status]}</Badge>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: '#71717A' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} />{request.dropoffLocation.split(',')[0]}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CalendarBlank size={13} />{formatDate(request.createdAt, { format: 'relative' })}</span>
                </div>
                {request.driverName && !['completed', 'cancelled'].includes(request.status) && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #1F1F23', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#1A1A1F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: '#A1A1AA' }}>
                            {request.driverName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span style={{ fontSize: 12, color: '#A1A1AA' }}>{request.driverName}</span>
                    </div>
                )}
            </Card>
        </Link>
    )
}

const myDashSkeleton = (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="page-section">
            <div style={{ height: 28, width: '60%', backgroundColor: '#1A1A1F', borderRadius: 8, marginBottom: 8, animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
            <div style={{ height: 16, width: '35%', backgroundColor: '#1A1A1F', borderRadius: 6, animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
        </div>
        <div className="page-section grid-stats">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} lines={1} style={{ minHeight: 80 }} />)}
        </div>
        <div className="page-section"><SkeletonCard lines={2} /></div>
        <div className="page-section grid-cards">
            {[1, 2].map(i => <SkeletonCard key={i} lines={3} />)}
        </div>
    </div>
)

export default function ClientDashboard() {
    const { currentUser } = useAuthStore()
    const [loading, setLoading] = useState(true)
    const mobile = useIsMobile()

    useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t) }, [])

    if (loading) return myDashSkeleton

    const firstName = currentUser?.fullName?.split(' ')[0] || 'there'
    const greeting = getGreeting()
    const myRequests = MOCK_REQUESTS.filter(r => r.clientId === currentUser?.id)
    const activeRequests = myRequests.filter(r => ['submitted', 'reviewed', 'assigned', 'in_progress'].includes(r.status))
    const recentCompleted = myRequests.filter(r => r.status === 'completed').slice(0, 3)

    return (
        <PageTransition>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                {/* Greeting */}
                <div className="page-section">
                    <h1 className="heading-1">Good {greeting}, {firstName}</h1>
                    <p className="muted-text" style={{ marginTop: 4 }}>Your Butler membership is active.</p>
                </div>

                {/* Stats */}
                <FadeIn delay={0.1}>
                    <div className="page-section grid-stats">
                        <StatsCard label="Active" value={activeRequests.length} mobile={mobile} />
                        <StatsCard label="Completed" value={recentCompleted.length} mobile={mobile} />
                        <StatsCard label="Time Saved" value={`${recentCompleted.length * 1.5}h`} subtext="This month" mobile={mobile} />
                        <StatsCard label="Membership" value="Active" subtext="$199/mo" mobile={mobile} />
                    </div>
                </FadeIn>

                {/* New Request CTA */}
                <FadeIn delay={0.15}>
                    <div className="page-section">
                        <Link to="/requests/new" style={{ textDecoration: 'none' }}>
                            <div style={{
                                position: 'relative', overflow: 'hidden', borderRadius: 14,
                                border: '1px solid rgba(201,168,76,0.2)', padding: '24px 28px',
                                background: 'linear-gradient(135deg, rgba(201,168,76,0.04), rgba(201,168,76,0.08))',
                                cursor: 'pointer', transition: 'border-color 200ms',
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                            <Plus size={20} weight="bold" style={{ color: '#C9A84C' }} />
                                            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#F5F5F4' }}>New Request</h3>
                                        </div>
                                        <p style={{ fontSize: 14, color: '#71717A' }}>What can we do for you today?</p>
                                    </div>
                                    <ArrowRight size={24} style={{ color: '#C9A84C' }} />
                                </div>
                            </div>
                        </Link>
                    </div>
                </FadeIn>

                {/* Active Requests */}
                {activeRequests.length > 0 && (
                    <FadeIn delay={0.2}>
                        <div className="page-section">
                            <div className="section-header">
                                <h2 className="heading-2">Active Requests</h2>
                                <Link to="/requests" style={{ fontSize: 14, color: '#C9A84C', textDecoration: 'none' }}>View all</Link>
                            </div>
                            <StaggerContainer staggerDelay={0.06} className="grid-cards">
                                {activeRequests.map(req => <StaggerItem key={req.id}><RequestCard request={req} /></StaggerItem>)}
                            </StaggerContainer>
                        </div>
                    </FadeIn>
                )}

                {/* Recent Completions */}
                {recentCompleted.length > 0 && (
                    <FadeIn delay={0.25}>
                        <div className="page-section">
                            <div className="section-header">
                                <h2 className="heading-2">Recently Completed</h2>
                            </div>
                            <StaggerContainer staggerDelay={0.06} className="grid-cards">
                                {recentCompleted.map(req => <StaggerItem key={req.id}><RequestCard request={req} /></StaggerItem>)}
                            </StaggerContainer>
                        </div>
                    </FadeIn>
                )}

                {/* Empty State */}
                {myRequests.length === 0 && (
                    <FadeIn delay={0.15}>
                        <div className="page-section" style={{ textAlign: 'center', padding: '64px 0' }}>
                            <div style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: '#1A1A1F', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                <Basket size={32} style={{ color: '#71717A' }} />
                            </div>
                            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#F5F5F4', marginBottom: 4 }}>No requests yet</h3>
                            <p style={{ fontSize: 14, color: '#71717A', marginBottom: 16 }}>Submit your first errand request and we&apos;ll handle the rest.</p>
                            <Link to="/requests/new"><Button>Submit a Request</Button></Link>
                        </div>
                    </FadeIn>
                )}
            </div>
        </PageTransition>
    )
}
