import { useState, useEffect } from 'react'
import { Card, SkeletonCard } from '@/components/ui'
import { toast } from 'sonner'
import { formatDate, formatCurrency } from '@/lib/utils'
import { MOCK_METRICS, MOCK_ACTIVITY, MOCK_ALL_USERS, MOCK_CHART_DATA } from '@/mock/data'
import { Link } from 'react-router-dom'
import { PageTransition } from '@/components/motion/Animations'
import { usePageTitle, useIsMobile } from '@/hooks/useEdgeCases'
import { Users, Car, CreditCard, CurrencyDollar, ClockCounterClockwise, ArrowRight, TrendUp, CheckCircle, XCircle, ChartBar, Globe, Timer, ShoppingCart, Percent, Target } from '@phosphor-icons/react'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function MetricCard({ label, value, icon: Icon, trend, color = '#A1A1AA' }) {
    return (
        <div style={{ backgroundColor: '#111113', border: '1px solid #27272A', borderRadius: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2vw, 16px) clamp(14px, 2.5vw, 20px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: '#1A1A1F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} style={{ color }} />
                </div>
                {trend && <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 11, color: '#22C55E', fontWeight: 600 }}><TrendUp size={11} weight="bold" />{trend}</span>}
            </div>
            <p style={{ fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 700, color: '#F5F5F4', lineHeight: 1.1 }}>{value}</p>
            <p style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', color: '#71717A', marginTop: 4 }}>{label}</p>
        </div>
    )
}

const CHART_TOOLTIP_STYLE = { backgroundColor: '#1A1A1F', border: '1px solid #27272A', borderRadius: 8, fontSize: 12, color: '#F5F5F4' }

// Activity icon/color mapping
const ACTIVITY_COLORS = {
    order_completed: '#22C55E', order_assigned: '#8B5CF6', order_submitted: '#F59E0B',
    order_pickup: '#3B82F6', order_cancelled: '#EF4444', subscription_new: '#C9A84C',
    rating: '#F59E0B', driver_application: '#3B82F6',
}

export default function AdminDashboard() {
    usePageTitle('Admin Dashboard')
    const mobile = useIsMobile()
    const [loading, setLoading] = useState(true)
    useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t) }, [])

    if (loading) return (
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="page-section" style={{ height: 40, width: '50%', backgroundColor: '#1A1A1F', borderRadius: 8, animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
            <div className="page-section grid-stats">{[1, 2, 3, 4].map(i => <SkeletonCard key={i} lines={2} />)}</div>
            <div className="page-section grid-2col">{[1, 2].map(i => <SkeletonCard key={i} lines={5} />)}</div>
        </div>
    )

    const m = MOCK_METRICS
    const pendingDrivers = MOCK_ALL_USERS.filter(u => u.role === 'driver' && u.approvalStatus === 'pending')

    return (
        <PageTransition>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <div className="page-section">
                    <h1 className="heading-1">Admin Dashboard</h1>
                    <p className="muted-text" style={{ marginTop: 4 }}>Platform command center — all territories, all data.</p>
                </div>

                {/* ── Platform Metrics ── */}
                <div className="page-section">
                    <h2 className="heading-2" style={{ marginBottom: 12 }}>Platform Metrics</h2>
                    <div className="grid-stats">
                        <MetricCard label="Active Clients" value={m.activeClients} icon={Users} trend="+3" color="#3B82F6" />
                        <MetricCard label="Active Drivers" value={m.activeDrivers} icon={Car} trend="+1" color="#22C55E" />
                        <MetricCard label="Active Territories" value={m.activeTerritories} icon={Globe} color="#8B5CF6" />
                        <MetricCard label="Monthly Revenue (MRR)" value={formatCurrency(m.mrr)} icon={CurrencyDollar} trend="12%" color="#C9A84C" />
                        <MetricCard label="Annual Revenue (ARR)" value={formatCurrency(m.arr)} icon={CurrencyDollar} color="#C9A84C" />
                        <MetricCard label="Customer Acq. Cost" value={formatCurrency(m.cac)} icon={Target} color="#F97316" />
                        <MetricCard label="Client Lifetime Value" value={formatCurrency(m.ltv)} icon={TrendUp} color="#22C55E" />
                        <MetricCard label="LTV:CAC Ratio" value={`${m.ltvCacRatio}x`} icon={ChartBar} color="#3B82F6" />
                        <MetricCard label="Client Churn Rate" value={`${(m.churnRate * 100).toFixed(1)}%`} icon={Percent} color="#EF4444" />
                    </div>
                </div>

                {/* ── Operational Metrics ── */}
                <div className="page-section">
                    <h2 className="heading-2" style={{ marginBottom: 12 }}>Operational Metrics</h2>
                    <div className="grid-stats">
                        <MetricCard label="Total Orders" value={m.totalOrders} icon={ShoppingCart} color="#A1A1AA" />
                        <MetricCard label="Orders Today" value={m.ordersToday} icon={ShoppingCart} color="#F59E0B" />
                        <MetricCard label="In Progress" value={m.ordersInProgress} icon={ClockCounterClockwise} color="#F97316" />
                        <MetricCard label="Completed Today" value={m.completedToday} icon={CheckCircle} color="#22C55E" />
                        <MetricCard label="Avg Completion Time" value={`${m.avgCompletionTime}m`} icon={Timer} color="#3B82F6" />
                        <MetricCard label="Avg Orders / Client" value={m.avgOrdersPerClient} icon={Users} color="#8B5CF6" />
                        <MetricCard label="Dispute Rate" value={`${(m.disputeRate * 100).toFixed(1)}%`} icon={XCircle} color="#EF4444" />
                    </div>
                </div>

                {/* ── Charts ── */}
                <div className="page-section">
                    <h2 className="heading-2" style={{ marginBottom: 12 }}>Analytics</h2>
                    <div className="grid-2col">
                        {/* Orders Over Time */}
                        <Card>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#A1A1AA', marginBottom: 16 }}>Orders Over Time</p>
                            <ResponsiveContainer width="100%" height={200}>
                                <AreaChart data={MOCK_CHART_DATA.ordersOverTime}>
                                    <defs><linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C9A84C" stopOpacity={0.3} /><stop offset="100%" stopColor="#C9A84C" stopOpacity={0} /></linearGradient></defs>
                                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} width={30} />
                                    <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                                    <Area type="monotone" dataKey="orders" stroke="#C9A84C" strokeWidth={2} fill="url(#goldGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Card>

                        {/* Revenue by Territory */}
                        <Card>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#A1A1AA', marginBottom: 16 }}>Revenue by Territory</p>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={MOCK_CHART_DATA.revenueByTerritory}>
                                    <XAxis dataKey="territory" tick={{ fontSize: 10, fill: '#71717A' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} width={40} />
                                    <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={(v) => formatCurrency(v)} />
                                    <Bar dataKey="revenue" fill="#C9A84C" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>

                        {/* Client Growth */}
                        <Card>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#A1A1AA', marginBottom: 16 }}>Client Growth</p>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={MOCK_CHART_DATA.clientGrowth}>
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} width={30} />
                                    <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                                    <Line type="monotone" dataKey="clients" stroke="#22C55E" strokeWidth={2} dot={{ r: 3, fill: '#22C55E' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>

                        {/* Order Status Distribution */}
                        <Card>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#A1A1AA', marginBottom: 16 }}>Order Status Distribution</p>
                            <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', alignItems: 'center', gap: 16 }}>
                                <ResponsiveContainer width={mobile ? '100%' : '50%'} height={mobile ? 150 : 180}>
                                    <PieChart>
                                        <Pie data={MOCK_CHART_DATA.orderStatusDist} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2}>
                                            {MOCK_CHART_DATA.orderStatusDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                        </Pie>
                                        <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {MOCK_CHART_DATA.orderStatusDist.map(s => (
                                        <div key={s.status} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: s.color, flexShrink: 0 }} />
                                            <span style={{ fontSize: 11, color: '#A1A1AA' }}>{s.status}</span>
                                            <span style={{ fontSize: 11, color: '#71717A', marginLeft: 'auto' }}>{s.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 360, overflowY: 'auto' }}>
                            {MOCK_ACTIVITY.map(act => (
                                <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: '1px solid #1F1F23' }}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: ACTIVITY_COLORS[act.type] || '#71717A', marginTop: 6, flexShrink: 0 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 13, color: '#A1A1AA', lineHeight: 1.4 }}>{act.message}</p>
                                        <p style={{ fontSize: 11, color: '#52525B' }}>{formatDate(act.timestamp, { format: 'relative' })}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Pending Approvals */}
                    <Card>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <h2 className="heading-2">
                                Pending Approvals
                                {pendingDrivers.length > 0 && <span style={{ marginLeft: 8, fontSize: 14, fontWeight: 400, color: '#F59E0B' }}>({pendingDrivers.length})</span>}
                            </h2>
                            <Link to="/admin/drivers" style={{ fontSize: 13, color: '#C9A84C', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                                View all <ArrowRight size={13} />
                            </Link>
                        </div>
                        {pendingDrivers.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {pendingDrivers.map(driver => (
                                    <div key={driver.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 10, backgroundColor: '#1A1A1F' }}>
                                        <div>
                                            <p style={{ fontSize: 14, fontWeight: 500, color: '#F5F5F4' }}>{driver.fullName}</p>
                                            <p style={{ fontSize: 12, color: '#71717A' }}>{driver.vehicle?.make} {driver.vehicle?.model} {driver.vehicle?.year}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button onClick={() => toast.success('Driver approved', { description: driver.fullName })} style={{ height: 30, padding: '0 10px', borderRadius: 6, fontSize: 12, fontWeight: 500, backgroundColor: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)', cursor: 'pointer' }}>Approve</button>
                                            <button onClick={() => toast.error('Driver rejected', { description: driver.fullName })} style={{ height: 30, padding: '0 10px', borderRadius: 6, fontSize: 12, fontWeight: 500, backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer' }}>Reject</button>
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
