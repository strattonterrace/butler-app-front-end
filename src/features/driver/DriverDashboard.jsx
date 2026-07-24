import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Badge, Button, Card, SkeletonCard } from '@/components/ui'
import { toast } from 'sonner'
import { requestsApi } from '@/api/requests'
import { extractErrorMessage } from '@/api/client'
import { SERVICE_TYPES } from '@/lib/utils'
import { PageTransition } from '@/components/motion/Animations'
import { usePageTitle } from '@/hooks/useEdgeCases'
import { useUIStore } from '@/store/uiStore'
import { CheckCircle, ListChecks, MapPin, Play, ShoppingCart } from '@phosphor-icons/react'

const STATUS_BADGE = { assigned: 'purple', in_progress: 'warning' }
const STATUS_LABEL = { assigned: 'Assigned', in_progress: 'In Progress' }

function StatsCard({ label, value, icon: Icon, accent }) {
    const { theme } = useUIStore()
    const isLight = theme === 'light'
    return (
        <div style={{ backgroundColor: isLight ? '#FFFFFF' : '#111113', border: `1px solid ${isLight ? '#E4E4E7' : '#27272A'}`, borderRadius: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2vw, 16px) clamp(14px, 2.5vw, 20px)' }}>
            <Icon size={16} style={{ color: accent, marginBottom: 'clamp(4px, 1vw, 6px)' }} />
            <p style={{ fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 700, color: isLight ? '#1C1917' : '#F5F5F4', lineHeight: 1.1 }}>{value}</p>
            <p style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', color: '#71717A', marginTop: 'clamp(2px, 0.5vw, 4px)' }}>{label}</p>
        </div>
    )
}

function TaskCard({ request, type, onAdvance, busy }) {
    const { theme } = useUIStore()
    const isLight = theme === 'light'
    return (
        <Card>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: isLight ? '#1C1917' : '#F5F5F4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{request.title}</p>
                    <p style={{ fontSize: 12, color: '#71717A' }}>{SERVICE_TYPES[request.serviceType]?.label} · {request.clientName}</p>
                </div>
                <Badge variant={STATUS_BADGE[request.status]} size="sm">{STATUS_LABEL[request.status]}</Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#71717A', marginTop: 8, flexWrap: 'wrap' }}>
                <MapPin size={13} />{request.pickupLocation.split(',')[0]}
                <span style={{ margin: '0 4px' }}>→</span>{request.dropoffLocation.split(',')[0]}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: `1px solid ${isLight ? '#F0F0F0' : '#1F1F23'}` }}>
                <span style={{ fontSize: 12, color: '#71717A', textTransform: 'capitalize' }}>{request.urgency}</span>
                {type === 'assigned'
                    ? <Button size="sm" disabled={busy} onClick={() => onAdvance(request, 'in_progress', 'Task started')}><Play size={14} weight="fill" /> {busy ? 'Starting…' : 'Start Task'}</Button>
                    : <Button size="sm" variant="secondary" disabled={busy} onClick={() => onAdvance(request, 'completed', 'Task completed!')}><CheckCircle size={14} weight="bold" /> {busy ? 'Completing…' : 'Mark Completed'}</Button>
                }
            </div>
        </Card>
    )
}

export default function DriverDashboard() {
    const { currentUser } = useAuthStore()
    usePageTitle('Driver Dashboard')
    const [loading, setLoading] = useState(true)
    const [myTasks, setMyTasks] = useState([])
    const [stats, setStats] = useState(null)
    const [actingId, setActingId] = useState(null)

    // Backend visible_to() scopes /requests/ to this driver's own tasks.
    const load = useCallback(async () => {
        const [reqs, st] = await Promise.all([
            requestsApi.list({ ordering: '-updated_at' }).then(d => d.results ?? []).catch(() => []),
            requestsApi.stats().catch(() => null),
        ])
        setMyTasks(reqs)
        setStats(st)
    }, [])

    useEffect(() => {
        let active = true
        load()
            .catch((error) => { if (active) toast.error('Could not load dashboard', { description: extractErrorMessage(error) }) })
            .finally(() => { if (active) setLoading(false) })
        return () => { active = false }
    }, [load])

    const advance = async (req, nextStatus, label) => {
        setActingId(req.id)
        try {
            await requestsApi.transition(req.id, { status: nextStatus })
            toast.success(label, { description: req.title })
            await load()
        } catch (error) {
            toast.error('Could not update task', { description: extractErrorMessage(error) })
        } finally {
            setActingId(null)
        }
    }

    if (loading) return (
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div className="page-section" style={{ height: 40, width: '50%', backgroundColor: '#1A1A1F', borderRadius: 8, animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
            <div className="page-section grid-stats">{[1, 2, 3, 4].map(i => <SkeletonCard key={i} lines={1} />)}</div>
            <div className="page-section grid-cards">{[1, 2].map(i => <SkeletonCard key={i} lines={3} />)}</div>
        </div>
    )

    const firstName = currentUser?.fullName?.split(' ')[0] || 'Driver'
    const assigned = myTasks.filter(r => r.status === 'assigned')
    const inProgress = myTasks.filter(r => r.status === 'in_progress')

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

                {/* ── Real task counters (from /requests/stats/) ── */}
                <div className="page-section grid-stats">
                    <StatsCard label="Assigned" value={stats?.assigned ?? assigned.length} icon={ShoppingCart} accent="#8B5CF6" />
                    <StatsCard label="In Progress" value={stats?.inProgress ?? inProgress.length} icon={Play} accent="#F97316" />
                    <StatsCard label="Completed Today" value={stats?.completedToday ?? 0} icon={CheckCircle} accent="#22C55E" />
                    <StatsCard label="Completed (All Time)" value={stats?.completed ?? 0} icon={CheckCircle} accent="#22C55E" />
                </div>

                {/* ── Assigned Tasks ── */}
                {assigned.length > 0 && (
                    <div className="page-section">
                        <div className="section-header"><h2 className="heading-2">Assigned to You</h2></div>
                        <div className="grid-cards">
                            {assigned.map(req => <TaskCard key={req.id} request={req} type="assigned" onAdvance={advance} busy={actingId === req.id} />)}
                        </div>
                    </div>
                )}

                {/* ── In Progress ── */}
                {inProgress.length > 0 && (
                    <div className="page-section">
                        <div className="section-header"><h2 className="heading-2">In Progress</h2></div>
                        <div className="grid-cards">
                            {inProgress.map(req => <TaskCard key={req.id} request={req} type="in_progress" onAdvance={advance} busy={actingId === req.id} />)}
                        </div>
                    </div>
                )}

                {assigned.length === 0 && inProgress.length === 0 && (
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
