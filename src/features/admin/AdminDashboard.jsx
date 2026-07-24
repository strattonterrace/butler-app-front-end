import { useState, useEffect, useCallback } from 'react'
import { Card, SkeletonCard } from '@/components/ui'
import { toast } from 'sonner'
import { formatDate, formatCurrency } from '@/lib/utils'
import { adminApi } from '@/api/admin'
import { driversApi } from '@/api/drivers'
import { extractErrorMessage } from '@/api/client'
import { Link } from 'react-router-dom'
import { PageTransition } from '@/components/motion/Animations'
import { usePageTitle, useIsMobile } from '@/hooks/useEdgeCases'
import { useUIStore } from '@/store/uiStore'
import { Users, Car, CreditCard, CurrencyDollar, ClockCounterClockwise, ArrowRight, CheckCircle, ShoppingCart, Percent, UserPlus } from '@phosphor-icons/react'

function MetricCard({ label, value, icon: Icon, color = '#A1A1AA' }) {
    const { theme } = useUIStore()
    const isLight = theme === 'light'
    return (
        <div style={{ backgroundColor: isLight ? '#FFFFFF' : '#111113', border: `1px solid ${isLight ? '#E4E4E7' : '#27272A'}`, borderRadius: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2vw, 16px) clamp(14px, 2.5vw, 20px)' }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: isLight ? '#F4F4F5' : '#1A1A1F', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Icon size={16} style={{ color }} />
            </div>
            <p style={{ fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 700, color: isLight ? '#1C1917' : '#F5F5F4', lineHeight: 1.1 }}>{value}</p>
            <p style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', color: '#71717A', marginTop: 4 }}>{label}</p>
        </div>
    )
}

export default function AdminDashboard() {
    usePageTitle('Admin Dashboard')
    const mobile = useIsMobile()
    const [loading, setLoading] = useState(true)
    const [metrics, setMetrics] = useState(null)
    const [activity, setActivity] = useState([])
    const [pending, setPending] = useState([])
    const [actingId, setActingId] = useState(null)

    const load = useCallback(async () => {
        const [m, a, p] = await Promise.all([
            adminApi.metrics().catch(() => null),
            adminApi.activity(20).catch(() => []),
            driversApi.pending().catch(() => []),
        ])
        setMetrics(m)
        setActivity(a)
        setPending(p)
    }, [])

    useEffect(() => {
        let active = true
        load()
            .catch((error) => { if (active) toast.error('Could not load dashboard', { description: extractErrorMessage(error) }) })
            .finally(() => { if (active) setLoading(false) })
        return () => { active = false }
    }, [load])

    const approve = async (driver) => {
        setActingId(driver.id)
        try {
            await driversApi.approve(driver.id)
            toast.success('Driver approved', { description: driver.name })
            await load()
        } catch (error) {
            toast.error('Could not approve driver', { description: extractErrorMessage(error) })
        } finally {
            setActingId(null)
        }
    }

    const reject = async (driver) => {
        const reason = window.prompt(`Reject ${driver.name}'s application? Optional reason:`)
        if (reason === null) return
        setActingId(driver.id)
        try {
            await driversApi.reject(driver.id, reason.trim())
            toast.success('Application declined', { description: driver.name })
            await load()
        } catch (error) {
            toast.error('Could not reject driver', { description: extractErrorMessage(error) })
        } finally {
            setActingId(null)
        }
    }

    if (loading) return (
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="page-section" style={{ height: 40, width: '50%', backgroundColor: '#1A1A1F', borderRadius: 8, animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
            <div className="page-section grid-stats">{[1, 2, 3, 4].map(i => <SkeletonCard key={i} lines={2} />)}</div>
            <div className="page-section grid-2col">{[1, 2].map(i => <SkeletonCard key={i} lines={5} />)}</div>
        </div>
    )

    const m = metrics ?? {}

    return (
        <PageTransition>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <div className="page-section">
                    <h1 className="heading-1">Admin Dashboard</h1>
                    <p className="muted-text" style={{ marginTop: 4 }}>Platform command center — all territories, all data.</p>
                </div>

                {/* ── Platform Metrics (real) ── */}
                <div className="page-section">
                    <h2 className="heading-2" style={{ marginBottom: 12 }}>Platform Metrics</h2>
                    <div className="grid-stats">
                        <MetricCard label="Total Clients" value={m.totalClients ?? 0} icon={Users} color="#3B82F6" />
                        <MetricCard label="Active Subscribers" value={m.activeSubscribers ?? 0} icon={CreditCard} color="#22C55E" />
                        <MetricCard label="Total Drivers" value={m.totalDrivers ?? 0} icon={Car} color="#8B5CF6" />
                        <MetricCard label="Monthly Revenue (MRR)" value={formatCurrency(Number(m.monthlyRevenue ?? 0))} icon={CurrencyDollar} color="#C9A84C" />
                        <MetricCard label="Total Collected" value={formatCurrency(Number(m.totalRevenue ?? 0))} icon={CurrencyDollar} color="#C9A84C" />
                        <MetricCard label="Churn Rate (30d)" value={`${((m.churnRate ?? 0) * 100).toFixed(1)}%`} icon={Percent} color="#EF4444" />
                    </div>
                </div>

                {/* ── Operational Metrics (real) ── */}
                <div className="page-section">
                    <h2 className="heading-2" style={{ marginBottom: 12 }}>Operational Metrics</h2>
                    <div className="grid-stats">
                        <MetricCard label="Total Requests" value={m.totalRequests ?? 0} icon={ShoppingCart} color="#A1A1AA" />
                        <MetricCard label="Active Requests" value={m.activeRequests ?? 0} icon={ClockCounterClockwise} color="#F97316" />
                        <MetricCard label="Completed Today" value={m.completedRequestsToday ?? 0} icon={CheckCircle} color="#22C55E" />
                        <MetricCard label="Pending Driver Apps" value={m.pendingDriverApplications ?? 0} icon={UserPlus} color="#F59E0B" />
                    </div>
                </div>

                {/* ── Live Operations Feed + Pending Approvals ── */}
                <div className="page-section grid-2col">
                    {/* Live Operations Feed */}
                    <Card>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <h2 className="heading-2">Live Operations</h2>
                            <span style={{ fontSize: 11, color: '#22C55E', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#22C55E', animation: 'skeleton-pulse 2s ease-in-out infinite' }} /> Live
                            </span>
                        </div>
                        {activity.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 360, overflowY: 'auto' }}>
                                {activity.map(act => (
                                    <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: '1px solid #1F1F23' }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#71717A', marginTop: 6, flexShrink: 0 }} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: 13, color: '#A1A1AA', lineHeight: 1.4 }}>{act.message}</p>
                                            <p style={{ fontSize: 11, color: '#52525B' }}>{formatDate(act.createdAt, { format: 'relative' })}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ textAlign: 'center', fontSize: 14, color: '#71717A', padding: '32px 0' }}>No activity yet.</p>
                        )}
                    </Card>

                    {/* Pending Approvals */}
                    <Card>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <h2 className="heading-2">
                                Pending Approvals
                                {pending.length > 0 && <span style={{ marginLeft: 8, fontSize: 14, fontWeight: 400, color: '#F59E0B' }}>({pending.length})</span>}
                            </h2>
                            <Link to="/admin/drivers" style={{ fontSize: 13, color: '#C9A84C', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                                View all <ArrowRight size={13} />
                            </Link>
                        </div>
                        {pending.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {pending.map(driver => (
                                    <div key={driver.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 10, backgroundColor: '#1A1A1F' }}>
                                        <div>
                                            <p style={{ fontSize: 14, fontWeight: 500, color: '#F5F5F4' }}>{driver.name}</p>
                                            <p style={{ fontSize: 12, color: '#71717A' }}>{driver.vehicle}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button disabled={actingId === driver.id} onClick={() => approve(driver)} style={{ height: 30, padding: '0 10px', borderRadius: 6, fontSize: 12, fontWeight: 500, backgroundColor: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)', cursor: 'pointer' }}>Approve</button>
                                            <button disabled={actingId === driver.id} onClick={() => reject(driver)} style={{ height: 30, padding: '0 10px', borderRadius: 6, fontSize: 12, fontWeight: 500, backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer' }}>Reject</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ textAlign: 'center', fontSize: 14, color: '#71717A', padding: '32px 0' }}>No pending applications.</p>
                        )}
                    </Card>
                </div>

                {/* ── Quick Links ── */}
                <div className="page-section grid-stats">
                    {[
                        { to: '/admin/users', label: 'Manage Users', icon: Users },
                        { to: '/admin/requests', label: 'All Requests', icon: ClockCounterClockwise },
                        { to: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
                        { to: '/admin/revenue', label: 'Revenue', icon: CurrencyDollar },
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
